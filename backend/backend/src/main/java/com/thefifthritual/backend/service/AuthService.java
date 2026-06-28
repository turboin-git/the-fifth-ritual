package com.thefifthritual.backend.service;

import com.thefifthritual.backend.dto.request.LoginRequest;
import com.thefifthritual.backend.dto.request.RegisterRequest;
import com.thefifthritual.backend.dto.response.AuthResponse;
import com.thefifthritual.backend.entity.Artist;
import com.thefifthritual.backend.entity.Client;
import com.thefifthritual.backend.entity.User;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.ClientRepository;
import com.thefifthritual.backend.repository.UserRepository;
import com.thefifthritual.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        userRepository.save(user);

        if (request.getRole() == User.Role.ARTIST) {
            Artist artist = new Artist();
            artist.setUser(user);
            artistRepository.save(artist);
        } else if (request.getRole() == User.Role.CLIENT) {
            Client client = new Client();
            client.setUser(user);
            clientRepository.save(client);
        }

        log.info("New user registered: {}", user.getEmail());
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId());
    }

    public void validateCredentials(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );
    }

    public AuthResponse loginAfterOtp(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        log.info("User logged in after OTP: {}", user.getEmail());
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId());
    }
}