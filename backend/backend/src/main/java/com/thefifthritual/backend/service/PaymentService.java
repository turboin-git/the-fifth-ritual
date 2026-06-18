package com.thefifthritual.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.entity.Payment;
import com.thefifthritual.backend.repository.AppointmentRepository;
import com.thefifthritual.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    @Value("${khalti.secret-key}")
    private String khaltiSecretKey;

    @Value("${khalti.base-url}")
    private String khaltiBaseUrl;

    @Value("${khalti.return-url}")
    private String returnUrl;

    @Value("${khalti.website-url}")
    private String websiteUrl;

    public Map<String, Object> initiateKhaltiPayment(Long appointmentId, BigDecimal amount, String type) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Khalti expects amount in paisa (multiply by 100)
        int amountInPaisa = amount.multiply(BigDecimal.valueOf(100)).intValue();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Key " + khaltiSecretKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("return_url", returnUrl);
        body.put("website_url", websiteUrl);
        body.put("amount", amountInPaisa);
        body.put("purchase_order_id", "APPT-" + appointmentId);
        body.put("purchase_order_name", "Tattoo Appointment #" + appointmentId);

        String clientName = appointment.getClient().getUser().getName();
        String clientEmail = appointment.getClient().getUser().getEmail();

        Map<String, String> customerInfo = new HashMap<>();
        customerInfo.put("name", clientName);
        customerInfo.put("email", clientEmail);
        body.put("customer_info", customerInfo);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    khaltiBaseUrl + "/epayment/initiate/", request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());

            String pidx = json.get("pidx").asText();
            String paymentUrl = json.get("payment_url").asText();

            // Save pending payment record
            Payment payment = paymentRepository.findByAppointmentId(appointmentId)
                    .orElse(new Payment());
            payment.setAppointment(appointment);
            payment.setAmount(amount);
            payment.setType(Payment.Type.valueOf(type.toUpperCase()));
            payment.setStatus(Payment.Status.PENDING);
            payment.setGateway(Payment.Gateway.KHALTI);
            payment.setMethod(Payment.Method.KHALTI);
            payment.setPidx(pidx);
            paymentRepository.save(payment);

            log.info("Khalti payment initiated for appointment {}: pidx={}", appointmentId, pidx);

            Map<String, Object> result = new HashMap<>();
            result.put("paymentUrl", paymentUrl);
            result.put("pidx", pidx);
            return result;

        } catch (Exception e) {
            log.error("Khalti initiation failed: {}", e.getMessage());
            throw new RuntimeException("Failed to initiate payment: " + e.getMessage());
        }
    }

    public Payment verifyKhaltiPayment(String pidx) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Key " + khaltiSecretKey);
        headers.set("Content-Type", "application/json");

        Map<String, String> body = new HashMap<>();
        body.put("pidx", pidx);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    khaltiBaseUrl + "/epayment/lookup/", request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());
            String status = json.get("status").asText();

            Payment payment = paymentRepository.findByPidx(pidx)
                    .orElseThrow(() -> new RuntimeException("Payment record not found"));

            if ("Completed".equalsIgnoreCase(status)) {
                payment.setStatus(Payment.Status.SUCCESS);
                payment.setTransactionId(json.has("transaction_id") ?
                        json.get("transaction_id").asText() : pidx);
                payment.setPaidAt(LocalDateTime.now());
            } else if ("Expired".equalsIgnoreCase(status) || "User canceled".equalsIgnoreCase(status)) {
                payment.setStatus(Payment.Status.FAILED);
            }

            paymentRepository.save(payment);
            log.info("Payment verified for pidx {}: status={}", pidx, status);
            return payment;

        } catch (Exception e) {
            log.error("Khalti verification failed: {}", e.getMessage());
            throw new RuntimeException("Failed to verify payment: " + e.getMessage());
        }
    }

    public Payment getByAppointmentId(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}