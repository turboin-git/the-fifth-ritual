package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Get available slots for an artist on a date
    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam Long artistId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(artistId, date));
    }

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Map<String, Object> request) {
        Long clientId = Long.valueOf(request.get("clientId").toString());
        Long artistId = Long.valueOf(request.get("artistId").toString());
        Long designId = request.get("designId") != null ?
                Long.valueOf(request.get("designId").toString()) : null;
        LocalDate date = LocalDate.parse(request.get("date").toString());
        LocalTime time = LocalTime.parse(request.get("timeSlot").toString());
        String notes = request.getOrDefault("notes", "").toString();

        return ResponseEntity.ok(
                appointmentService.bookAppointment(clientId, artistId, designId, date, time, notes)
        );
    }

    // Get all appointments for a client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Appointment>> getClientAppointments(@PathVariable Long clientId) {
        return ResponseEntity.ok(appointmentService.getClientAppointments(clientId));
    }

    // Get all appointments for an artist
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Appointment>> getArtistAppointments(@PathVariable Long artistId) {
        return ResponseEntity.ok(appointmentService.getArtistAppointments(artistId));
    }

    // Update appointment status
    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Appointment.Status status = Appointment.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    // Get all appointments (admin)
    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}