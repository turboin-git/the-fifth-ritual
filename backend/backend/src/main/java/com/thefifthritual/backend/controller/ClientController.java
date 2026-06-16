package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.response.ClientProfileResponse;
import com.thefifthritual.backend.entity.Client;
import com.thefifthritual.backend.repository.ClientRepository;
import com.thefifthritual.backend.service.ConsentFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;
    private final ConsentFormService consentFormService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ClientProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        boolean hasConsent = consentFormService.hasValidConsent(client.getId());

        ClientProfileResponse response = new ClientProfileResponse(
                client.getId(),
                client.getUser().getId(),
                client.getUser().getName(),
                client.getUser().getEmail(),
                hasConsent
        );

        return ResponseEntity.ok(response);
    }
}