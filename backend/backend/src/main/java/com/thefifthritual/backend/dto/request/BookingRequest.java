package com.thefifthritual.backend.dto.request;

import lombok.Data;

@Data
public class BookingRequest {
    private Long clientId;
    private Long artistId;
    private Long designId;
    private String date;
    private String timeSlot;
    private String notes;
}