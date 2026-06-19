package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.response.AdminStatsResponse;
import com.thefifthritual.backend.entity.Client;
import java.util.List;
import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import com.thefifthritual.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClientRepository clientRepository;
    private final ArtistRepository artistRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

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

    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Long userId = client.getUser().getId();
        clientRepository.delete(client);
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }
}