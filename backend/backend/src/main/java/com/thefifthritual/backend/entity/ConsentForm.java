package com.thefifthritual.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "consent_forms")
@Data
@NoArgsConstructor
public class ConsentForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "client_id", nullable = false, unique = true)
    private Client client;

    @Column(name = "has_allergies", nullable = false)
    private Boolean hasAllergies = false;

    @Column(name = "allergy_details", columnDefinition = "TEXT")
    private String allergyDetails;

    @Column(name = "has_conditions", nullable = false)
    private Boolean hasConditions = false;

    @Column(name = "conditions_details", columnDefinition = "TEXT")
    private String conditionsDetails;

    @Column(name = "legal_agreed", nullable = false)
    private Boolean legalAgreed = false;

    @Column(name = "signed_at", nullable = false)
    private LocalDateTime signedAt = LocalDateTime.now();
}