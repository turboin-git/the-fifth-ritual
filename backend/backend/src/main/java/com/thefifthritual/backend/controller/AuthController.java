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
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request) {
        authService.validateCredentials(request);
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        otpService.generateAndSendOtp(user.getEmail(), user.getName());
        return ResponseEntity.ok(Map.of(
                "otpSent", true,
                "email", user.getEmail(),
                "message", "OTP sent to your email"
        ));
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