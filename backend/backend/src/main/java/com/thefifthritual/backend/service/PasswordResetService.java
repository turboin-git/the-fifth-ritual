package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.PasswordResetToken;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.PasswordResetTokenRepository;
import com.thefifthritual.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void requestPasswordReset(String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        // Delete any existing tokens for this email
        tokenRepository.deleteByEmail(email);

        // Generate new token
        String token = UUID.randomUUID().toString();

        // Save token with 30 minute expiry
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        // Send email
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, user.getName(), resetLink);

        log.info("Password reset requested for: {}", email);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find token
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        // Check if token is expired
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }

        // Check if token already used
        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset link has already been used.");
        }

        // Find user and update password
        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Password reset successful for: {}", resetToken.getEmail());
    }
}