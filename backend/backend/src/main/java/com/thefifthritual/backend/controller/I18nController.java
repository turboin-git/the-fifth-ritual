package com.thefifthritual.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/i18n")
@RequiredArgsConstructor
public class I18nController {

    private final MessageSource messageSource;

    private static final String[] MESSAGE_KEYS = {
            "app.name", "app.tagline", "welcome.message",
            "login.title", "login.email", "login.password", "login.button",
            "register.title", "register.name", "register.phone", "register.button",
            "booking.title", "booking.step.artist", "booking.step.design",
            "booking.step.datetime", "booking.step.review", "booking.step.payment",
            "consent.title", "consent.submit",
            "dashboard.title", "dashboard.upcoming",
            "nav.home", "nav.about", "nav.contact", "nav.designs",
            "nav.signin", "nav.getstarted",
            "error.notfound", "error.unauthorized"
    };

    @GetMapping("/{lang}")
    public ResponseEntity<Map<String, String>> getMessages(@PathVariable String lang) {
        Locale locale = lang.equals("ne") ? new Locale("ne") : Locale.ENGLISH;
        Map<String, String> messages = new HashMap<>();
        for (String key : MESSAGE_KEYS) {
            messages.put(key, messageSource.getMessage(key, null, locale));
        }
        return ResponseEntity.ok(messages);
    }
}