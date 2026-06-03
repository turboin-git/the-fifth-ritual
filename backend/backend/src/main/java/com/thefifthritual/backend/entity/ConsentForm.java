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
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name = "has_allergies")
    private Boolean hasAllergies = false;

    @Column(name = "allergy_details", columnDefinition = "TEXT")
    private String allergyDetails;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(name = "legal_agreement")
    private Boolean legalAgreement = false;

    @Column(name = "signed_at")
    private LocalDateTime signedAt = LocalDateTime.now();
}