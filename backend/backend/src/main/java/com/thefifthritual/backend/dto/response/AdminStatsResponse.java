package com.thefifthritual.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    private long totalClients;
    private long totalArtists;
    private long totalAppointments;
    private long pendingAppointments;
    private BigDecimal totalRevenue;
}