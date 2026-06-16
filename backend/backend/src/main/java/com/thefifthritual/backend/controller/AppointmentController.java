package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.request.BookingRequest;
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

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam Long artistId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(artistId, date));
    }

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody BookingRequest request) {
        LocalDate date = LocalDate.parse(request.getDate());
        LocalTime time = LocalTime.parse(request.getTimeSlot());

        return ResponseEntity.ok(
                appointmentService.bookAppointment(
                        request.getClientId(),
                        request.getArtistId(),
                        request.getDesignId(),
                        date,
                        time,
                        request.getNotes()
                )
        );
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Appointment>> getClientAppointments(@PathVariable Long clientId) {
        return ResponseEntity.ok(appointmentService.getClientAppointments(clientId));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Appointment>> getArtistAppointments(@PathVariable Long artistId) {
        return ResponseEntity.ok(appointmentService.getArtistAppointments(artistId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Appointment.Status status = Appointment.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}