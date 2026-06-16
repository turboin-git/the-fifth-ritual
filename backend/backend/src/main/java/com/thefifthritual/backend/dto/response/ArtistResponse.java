package com.thefifthritual.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtistResponse {
    private Long id;
    private String name;
    private String bio;
    private String specialization;
    private Integer experienceYears;
    private String profileImage;
}