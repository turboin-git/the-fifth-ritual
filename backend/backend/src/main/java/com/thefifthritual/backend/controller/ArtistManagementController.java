package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.entity.Artist;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/artists")
@RequiredArgsConstructor
public class ArtistManagementController {

    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Artist>> getAll() {
        return ResponseEntity.ok(artistRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Artist> createArtist(@RequestBody Map<String, String> body) {
        User user = new User();
        user.setName(body.get("fullName"));
        user.setEmail(body.get("email"));
        user.setPhone(body.get("phone"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        user.setRole(User.Role.ARTIST);
        User savedUser = userRepository.save(user);

        Artist artist = new Artist();
        artist.setUser(savedUser);
        artist.setBio(body.get("bio"));
        artist.setSpecialization(body.get("specialization"));
        artist.setExperienceYears(Integer.parseInt(body.getOrDefault("experienceYears", "0")));
        artist.setIsApproved(false);
        return ResponseEntity.ok(artistRepository.save(artist));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        User user = artist.getUser();
        if (body.containsKey("fullName")) user.setName(body.get("fullName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userRepository.save(user);

        if (body.containsKey("bio")) artist.setBio(body.get("bio"));
        if (body.containsKey("specialization")) artist.setSpecialization(body.get("specialization"));
        if (body.containsKey("experienceYears"))
            artist.setExperienceYears(Integer.parseInt(body.get("experienceYears")));

        return ResponseEntity.ok(artistRepository.save(artist));
    }

    @PutMapping("/{id}/approval")
    public ResponseEntity<Artist> setApproval(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        artist.setIsApproved(body.get("isApproved"));
        return ResponseEntity.ok(artistRepository.save(artist));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        Long userId = artist.getUser().getId();
        artistRepository.delete(artist);
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }
}