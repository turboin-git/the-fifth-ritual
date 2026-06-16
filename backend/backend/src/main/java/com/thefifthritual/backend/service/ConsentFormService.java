package com.thefifthritual.backend.service;

import com.thefifthritual.backend.dto.request.ConsentFormRequest;
import com.thefifthritual.backend.entity.Client;
import com.thefifthritual.backend.entity.ConsentForm;
import com.thefifthritual.backend.repository.ClientRepository;
import com.thefifthritual.backend.repository.ConsentFormRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsentFormService {

    private final ConsentFormRepository consentFormRepository;
    private final ClientRepository clientRepository;

    public ConsentForm submitConsentForm(ConsentFormRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Optional<ConsentForm> existing = consentFormRepository.findByClientId(request.getClientId());

        ConsentForm form = existing.orElse(new ConsentForm());
        form.setClient(client);
        form.setHasAllergies(request.getHasAllergies() != null ? request.getHasAllergies() : false);
        form.setAllergyDetails(request.getAllergyDetails());
        form.setHasConditions(request.getHasConditions() != null ? request.getHasConditions() : false);
        form.setConditionsDetails(request.getConditionsDetails());
        form.setLegalAgreed(request.getLegalAgreed() != null ? request.getLegalAgreed() : false);
        form.setSignedAt(LocalDateTime.now());

        ConsentForm saved = consentFormRepository.save(form);
        log.info("Consent form submitted for client: {}", request.getClientId());
        return saved;
    }

    public Optional<ConsentForm> getByClientId(Long clientId) {
        return consentFormRepository.findByClientId(clientId);
    }

    public boolean hasValidConsent(Long clientId) {
        return consentFormRepository.findByClientId(clientId)
                .map(ConsentForm::getLegalAgreed)
                .orElse(false);
    }
}