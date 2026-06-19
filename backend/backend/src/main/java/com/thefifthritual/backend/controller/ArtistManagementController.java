package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.entity.Artist;
import com.thefifthritual.backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/artists")
@RequiredArgsConstructor
public class ArtistManagementController {

    private final ArtistRepository artistRepository;

    @GetMapping
    public ResponseEntity<List<Artist>> getAll() {
        return ResponseEntity.ok(artistRepository.findAll());
    }

    @PutMapping("/{id}/approval")
    public ResponseEntity<Artist> setApproval(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        artist.setIsApproved(body.get("isApproved"));
        return ResponseEntity.ok(artistRepository.save(artist));
    }
}