package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.dto.request.LoginRequest;
import com.thefifthritual.backend.dto.request.RegisterRequest;
import com.thefifthritual.backend.dto.response.AuthResponse;
import com.thefifthritual.backend.service.AuthService;
import com.thefifthritual.backend.service.OtpService;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {
        authService.validateCredentials(request);

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Skip OTP for ADMIN and ARTIST — only CLIENT gets 2FA
        if (user.getRole() == User.Role.CLIENT || user.getRole() == User.Role.ARTIST) {
            otpService.generateAndSendOtp(user.getEmail(), user.getName());
            return ResponseEntity.ok(Map.of(
                    "otpSent", true,
                    "email", user.getEmail(),
                    "message", "OTP sent to your email"
            ));
        }

        // ADMIN and ARTIST — return JWT directly
        AuthResponse response = authService.loginAfterOtp(user.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        otpService.verifyOtp(email, otp);
        AuthResponse response = authService.loginAfterOtp(email);
        return ResponseEntity.ok(response);
    }
}