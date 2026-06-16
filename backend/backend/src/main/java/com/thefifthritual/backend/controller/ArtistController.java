package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.response.ArtistResponse;
import com.thefifthritual.backend.entity.Artist;
import com.thefifthritual.backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistRepository artistRepository;

    @GetMapping("/approved")
    public ResponseEntity<List<ArtistResponse>> getApprovedArtists() {
        List<Artist> artists = artistRepository.findByIsApprovedTrue();
        List<ArtistResponse> response = artists.stream()
                .map(a -> new ArtistResponse(
                        a.getId(),
                        a.getUser().getName(),
                        a.getBio(),
                        a.getSpecialization(),
                        a.getExperienceYears(),
                        a.getProfileImage()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }
}