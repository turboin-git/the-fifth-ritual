package com.thefifthritual.backend;

import com.thefifthritual.backend.dto.request.LoginRequest;
import com.thefifthritual.backend.dto.request.RegisterRequest;
import com.thefifthritual.backend.dto.response.AuthResponse;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.UserRepository;
import com.thefifthritual.backend.security.JwtTokenProvider;
import com.thefifthritual.backend.service.AuthService;
import com.thefifthritual.backend.service.EmailService;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Setup register request
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole(User.Role.CLIENT);
        registerRequest.setPhone("9800000000");

        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(User.Role.CLIENT);
    }

    // ===== REGISTER TESTS =====

    @Test
    void register_Success_ReturnsAuthResponse() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("mockToken");
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString());

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("CLIENT", response.getRole());
        assertEquals("Test User", response.getName());
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendWelcomeEmail(anyString(), anyString());
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));
        assertEquals("Email already in use", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_AsArtist_CreatesArtistProfile() {
        // Arrange
        registerRequest.setRole(User.Role.ARTIST);
        testUser.setRole(User.Role.ARTIST);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("mockToken");
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString());

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("ARTIST", response.getRole());
        verify(artistRepository, times(1)).save(any());
    }

    @Test
    void register_AsClient_CreatesClientProfile() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("mockToken");
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString());

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("CLIENT", response.getRole());
        verify(clientRepository, times(1)).save(any());
    }

    // ===== LOGIN TESTS =====

    @Test
    void login_Success_ReturnsAuthResponse() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("mockToken");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("CLIENT", response.getRole());
        assertEquals("Test User", response.getName());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(Exception.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_GeneratesJwtToken() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwtToken123");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertEquals("jwtToken123", response.getToken());
        verify(jwtTokenProvider, times(1)).generateToken(testUser.getEmail());
    }
}