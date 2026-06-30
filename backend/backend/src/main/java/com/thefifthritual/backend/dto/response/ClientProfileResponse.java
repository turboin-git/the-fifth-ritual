package com.thefifthritual.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientProfileResponse {
    private Long clientId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String medicalNotes;
    private String profilePicture;
    private String createdAt;
    private boolean hasValidConsent;
}