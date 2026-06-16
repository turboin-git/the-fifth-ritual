package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.request.ConsentFormRequest;
import com.thefifthritual.backend.entity.ConsentForm;
import com.thefifthritual.backend.service.ConsentFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/consent-forms")
@RequiredArgsConstructor
public class ConsentFormController {

    private final ConsentFormService consentFormService;

    @PostMapping("/submit")
    public ResponseEntity<ConsentForm> submit(@RequestBody ConsentFormRequest request) {
        return ResponseEntity.ok(consentFormService.submitConsentForm(request));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getByClient(@PathVariable Long clientId) {
        return consentFormService.getByClientId(clientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}/status")
    public ResponseEntity<Map<String, Boolean>> getStatus(@PathVariable Long clientId) {
        boolean valid = consentFormService.hasValidConsent(clientId);
        return ResponseEntity.ok(Map.of("hasValidConsent", valid));
    }
}