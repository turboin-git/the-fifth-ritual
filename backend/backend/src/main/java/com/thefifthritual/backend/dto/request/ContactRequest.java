package com.thefifthritual.backend.dto.request;

import lombok.Data;

@Data
public class ContactRequest {
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
}