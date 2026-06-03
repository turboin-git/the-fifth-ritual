package com.thefifthritual.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "artists")
@Data
@NoArgsConstructor
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String bio;
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "is_approved")
    private Boolean isApproved = false;
}