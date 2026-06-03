package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByArtistIdAndAppointmentDate(Long artistId, LocalDate date);
    List<Appointment> findByClientId(Long clientId);
    List<Appointment> findByArtistId(Long artistId);
    boolean existsByArtistIdAndAppointmentDateAndTimeSlot(Long artistId, LocalDate date, LocalTime timeSlot);
}