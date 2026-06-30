package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.response.ClientProfileResponse;
import com.thefifthritual.backend.entity.Client;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.ClientRepository;
import com.thefifthritual.backend.repository.UserRepository;
import com.thefifthritual.backend.service.ConsentFormService;
import com.thefifthritual.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ConsentFormService consentFormService;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ClientProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        boolean hasConsent = consentFormService.hasValidConsent(client.getId());

        ClientProfileResponse response = new ClientProfileResponse(
                client.getId(),
                client.getUser().getId(),
                client.getUser().getName(),
                client.getUser().getEmail(),
                client.getUser().getPhone(),
                client.getDateOfBirth(),
                client.getMedicalNotes(),
                client.getUser().getProfilePicture(),
                client.getUser().getCreatedAt() != null ? client.getUser().getCreatedAt().toString() : null,
                hasConsent
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<Map<String, String>> updateProfile(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        User user = client.getUser();
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userRepository.save(user);

        if (body.containsKey("dateOfBirth")) client.setDateOfBirth(body.get("dateOfBirth"));
        if (body.containsKey("medicalNotes")) client.setMedicalNotes(body.get("medicalNotes"));
        clientRepository.save(client);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PostMapping("/profile/{userId}/picture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));


        if (!fileStorageService.isValidImageFile(file)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed"));
        }

        String imageUrl = fileStorageService.storeFile(file, "profiles");
        User user = client.getUser();
        user.setProfilePicture(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @PutMapping("/profile/{userId}/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        User user = client.getUser();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}