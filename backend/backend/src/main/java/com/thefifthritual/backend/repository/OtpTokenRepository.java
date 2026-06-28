package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailOrderByExpiresAtDesc(String email);
    void deleteByEmail(String email);
}