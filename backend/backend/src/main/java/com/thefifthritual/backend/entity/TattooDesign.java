package com.thefifthritual.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tattoo_designs")
@Data
@NoArgsConstructor
public class TattooDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String style;
    private String size;
    private String theme;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "duration_hours", precision = 4, scale = 1)
    private BigDecimal durationHours = BigDecimal.ONE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}