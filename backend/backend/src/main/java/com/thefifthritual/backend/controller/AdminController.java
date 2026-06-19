package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.response.AdminStatsResponse;
import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClientRepository clientRepository;
    private final ArtistRepository artistRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        long totalClients = clientRepository.count();
        long totalArtists = artistRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getStatus() == Appointment.Status.PENDING)
                .count();

        BigDecimal totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus().name().equals("SUCCESS"))
                .map(p -> p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        AdminStatsResponse response = new AdminStatsResponse(
                totalClients, totalArtists, totalAppointments, pendingAppointments, totalRevenue
        );
        return ResponseEntity.ok(response);
    }
}