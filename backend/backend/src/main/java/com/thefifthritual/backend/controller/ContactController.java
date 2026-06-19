package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.request.ContactRequest;
import com.thefifthritual.backend.entity.ContactMessage;
import com.thefifthritual.backend.repository.ContactMessageRepository;
import com.thefifthritual.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submit(@RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        contactMessageRepository.save(message);
        log.info("New contact message from: {}", request.getEmail());

        try {
            emailService.sendContactNotificationEmail(
                    request.getName(), request.getEmail(),
                    request.getSubject(), request.getMessage());
        } catch (Exception e) {
            log.error("Failed to send contact notification: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Your message has been sent successfully!"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ContactMessage>> getAll() {
        return ResponseEntity.ok(contactMessageRepository.findAll());
    }
}