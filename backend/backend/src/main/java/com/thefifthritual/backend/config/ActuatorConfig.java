package com.thefifthritual.backend.config;

import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Map;

@Configuration
public class ActuatorConfig {

    @Bean
    public InfoContributor studioInfo() {
        return builder -> builder.withDetails(Map.of(
                "studio", Map.of(
                        "name", "The Fifth Ritual",
                        "version", "1.0.0",
                        "description", "Tattoo Studio Management System",
                        "contact", "admin@thefifthritual.com"
                )
        ));
    }
}