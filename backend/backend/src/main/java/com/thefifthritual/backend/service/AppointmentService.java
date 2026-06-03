package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.entity.Artist;
import com.thefifthritual.backend.entity.Client;
import com.thefifthritual.backend.repository.AppointmentRepository;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.ClientRepository;
import com.thefifthritual.backend.repository.TattooDesignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ArtistRepository artistRepository;
    private final ClientRepository clientRepository;
    private final TattooDesignRepository tattooDesignRepository;
    private final EmailService emailService;

    private static final List<LocalTime> ALL_SLOTS = List.of(
            LocalTime.of(10, 0),
            LocalTime.of(11, 0),
            LocalTime.of(12, 0),
            LocalTime.of(14, 0),
            LocalTime.of(15, 0),
            LocalTime.of(16, 0),
            LocalTime.of(17, 0)
    );

    public List<String> getAvailableSlots(Long artistId, LocalDate date) {
        List<Appointment> booked = appointmentRepository
                .findByArtistIdAndAppointmentDate(artistId, date);

        List<LocalTime> bookedTimes = booked.stream()
                .map(Appointment::getTimeSlot)
                .toList();

        List<String> available = new ArrayList<>();
        for (LocalTime slot : ALL_SLOTS) {
            if (!bookedTimes.contains(slot)) {
                available.add(slot.toString());
            }
        }
        return available;
    }

    public Appointment bookAppointment(Long clientId, Long artistId,
                                       Long designId, LocalDate date,
                                       LocalTime timeSlot, String notes) {
        boolean slotTaken = appointmentRepository
                .existsByArtistIdAndAppointmentDateAndTimeSlot(artistId, date, timeSlot);

        if (slotTaken) {
            throw new RuntimeException("This time slot is already booked!");
        }

        Appointment appointment = new Appointment();
        Client client = clientRepository.findById(clientId).orElseThrow();
        Artist artist = artistRepository.findById(artistId).orElseThrow();

        appointment.setClient(client);
        appointment.setArtist(artist);
        if (designId != null) {
            appointment.setDesign(
                    tattooDesignRepository.findById(designId).orElseThrow());
        }
        appointment.setAppointmentDate(date);
        appointment.setTimeSlot(timeSlot);
        appointment.setNotes(notes);
        appointment.setStatus(Appointment.Status.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        // Send booking confirmation email
        try {
            String clientEmail = client.getUser().getEmail();
            String clientName = client.getUser().getName();
            String artistName = artist.getUser().getName();
            emailService.sendBookingConfirmationEmail(
                    clientEmail, clientName, artistName,
                    date.toString(), timeSlot.toString()
            );
            log.info("Booking confirmed for client: {}", clientEmail);
        } catch (Exception e) {
            log.error("Failed to send booking email: {}", e.getMessage());
        }

        return saved;
    }

    public List<Appointment> getClientAppointments(Long clientId) {
        return appointmentRepository.findByClientId(clientId);
    }

    public List<Appointment> getArtistAppointments(Long artistId) {
        return appointmentRepository.findByArtistId(artistId);
    }

    public Appointment updateStatus(Long appointmentId, Appointment.Status status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        log.info("Appointment {} status updated to {}", appointmentId, status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}