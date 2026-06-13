package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is required"));
            }
            passwordResetService.requestPasswordReset(email);
            return ResponseEntity.ok(
                    Map.of("message", "Password reset link sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Token and new password are required"));
            }
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password must be at least 6 characters"));
            }
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok(
                    Map.of("message", "Password reset successful. You can now login."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}