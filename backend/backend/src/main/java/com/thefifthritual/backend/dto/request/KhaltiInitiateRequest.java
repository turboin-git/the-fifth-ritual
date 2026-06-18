package com.thefifthritual.backend.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class KhaltiInitiateRequest {
    private Long appointmentId;
    private BigDecimal amount;
    private String type;
}