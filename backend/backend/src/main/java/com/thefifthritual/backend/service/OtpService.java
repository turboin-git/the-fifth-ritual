package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.OtpToken;
import com.thefifthritual.backend.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;

    @Transactional
    public void generateAndSendOtp(String email, String userName) {
        // Delete any existing OTPs for this email
        otpTokenRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        token.setUsed(false);
        otpTokenRepository.save(token);

        // Send OTP email
        emailService.sendOtpEmail(email, userName, otp);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        OtpToken token = otpTokenRepository.findTopByEmailOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email"));

        if (token.isUsed()) throw new RuntimeException("OTP already used");
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) throw new RuntimeException("OTP expired");
        if (!token.getOtp().equals(otp)) throw new RuntimeException("Invalid OTP");

        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }
}