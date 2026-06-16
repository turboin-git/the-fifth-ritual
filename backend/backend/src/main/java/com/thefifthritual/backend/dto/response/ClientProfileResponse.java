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
    private boolean hasValidConsent;
}