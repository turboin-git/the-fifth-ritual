package com.thefifthritual.backend;

import com.thefifthritual.backend.entity.PasswordResetToken;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.PasswordResetTokenRepository;
import com.thefifthritual.backend.repository.UserRepository;
import com.thefifthritual.backend.service.EmailService;
import com.thefifthritual.backend.service.PasswordResetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private User testUser;
    private PasswordResetToken validToken;
    private PasswordResetToken expiredToken;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("oldEncodedPassword");
        testUser.setRole(User.Role.CLIENT);

        validToken = new PasswordResetToken();
        validToken.setId(1L);
        validToken.setEmail("test@example.com");
        validToken.setToken("valid-token-123");
        validToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        validToken.setUsed(false);

        expiredToken = new PasswordResetToken();
        expiredToken.setId(2L);
        expiredToken.setEmail("test@example.com");
        expiredToken.setToken("expired-token-456");
        expiredToken.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        expiredToken.setUsed(false);
    }

    // ===== REQUEST PASSWORD RESET TESTS =====

    @Test
    void requestPasswordReset_Success_SendsEmail() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        doNothing().when(tokenRepository).deleteByEmail(anyString());
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(validToken);
        doNothing().when(emailService).sendPasswordResetEmail(anyString(), anyString(), anyString());

        // Act
        passwordResetService.requestPasswordReset("test@example.com");

        // Assert
        verify(tokenRepository, times(1)).deleteByEmail("test@example.com");
        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(
                eq("test@example.com"), eq("Test User"), anyString());
    }

    @Test
    void requestPasswordReset_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> passwordResetService.requestPasswordReset("notfound@example.com"));
        assertEquals("No account found with this email", exception.getMessage());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString(), anyString());
    }

    @Test
    void requestPasswordReset_DeletesOldTokens() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(validToken);
        doNothing().when(emailService).sendPasswordResetEmail(anyString(), anyString(), anyString());

        // Act
        passwordResetService.requestPasswordReset("test@example.com");

        // Assert - old tokens deleted before new one created
        verify(tokenRepository, times(1)).deleteByEmail("test@example.com");
    }

    // ===== RESET PASSWORD TESTS =====

    @Test
    void resetPassword_Success_UpdatesPassword() {
        // Arrange
        when(tokenRepository.findByToken("valid-token-123")).thenReturn(Optional.of(validToken));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(validToken);

        // Act
        passwordResetService.resetPassword("valid-token-123", "newPassword123");

        // Assert
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(testUser);
        assertEquals("newEncodedPassword", testUser.getPassword());
    }

    @Test
    void resetPassword_MarksTokenAsUsed() {
        // Arrange
        when(tokenRepository.findByToken("valid-token-123")).thenReturn(Optional.of(validToken));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        passwordResetService.resetPassword("valid-token-123", "newPassword123");

        // Assert
        assertTrue(validToken.isUsed());
        verify(tokenRepository, times(1)).save(validToken);
    }

    @Test
    void resetPassword_InvalidToken_ThrowsException() {
        // Arrange
        when(tokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> passwordResetService.resetPassword("invalid-token", "newPassword123"));
        assertEquals("Invalid or expired reset link", exception.getMessage());
    }

    @Test
    void resetPassword_ExpiredToken_ThrowsException() {
        // Arrange
        when(tokenRepository.findByToken("expired-token-456")).thenReturn(Optional.of(expiredToken));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> passwordResetService.resetPassword("expired-token-456", "newPassword123"));
        assertEquals("Reset link has expired. Please request a new one.", exception.getMessage());
    }

    @Test
    void resetPassword_AlreadyUsedToken_ThrowsException() {
        // Arrange
        validToken.setUsed(true);
        when(tokenRepository.findByToken("valid-token-123")).thenReturn(Optional.of(validToken));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> passwordResetService.resetPassword("valid-token-123", "newPassword123"));
        assertEquals("Reset link has already been used.", exception.getMessage());
    }
}