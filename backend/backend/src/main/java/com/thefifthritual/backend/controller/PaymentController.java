package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.request.KhaltiInitiateRequest;
import com.thefifthritual.backend.entity.Payment;
import com.thefifthritual.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/khalti/initiate")
    public ResponseEntity<Map<String, Object>> initiate(@RequestBody KhaltiInitiateRequest request) {
        Map<String, Object> result = paymentService.initiateKhaltiPayment(
                request.getAppointmentId(), request.getAmount(), request.getType());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/khalti/verify")
    public ResponseEntity<Payment> verify(@RequestBody Map<String, String> body) {
        String pidx = body.get("pidx");
        return ResponseEntity.ok(paymentService.verifyKhaltiPayment(pidx));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Payment> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(paymentService.getByAppointmentId(appointmentId));
    }
}