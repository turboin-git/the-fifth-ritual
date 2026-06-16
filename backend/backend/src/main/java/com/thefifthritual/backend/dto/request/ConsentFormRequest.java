package com.thefifthritual.backend.dto.request;

import lombok.Data;

@Data
public class ConsentFormRequest {
    private Long clientId;
    private Boolean hasAllergies;
    private String allergyDetails;
    private Boolean hasConditions;
    private String conditionsDetails;
    private Boolean legalAgreed;
}