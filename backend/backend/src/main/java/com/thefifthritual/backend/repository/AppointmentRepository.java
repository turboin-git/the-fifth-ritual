package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByArtistIdAndScheduledAtBetween(Long artistId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByClientId(Long clientId);
    List<Appointment> findByArtistId(Long artistId);
    boolean existsByArtistIdAndScheduledAt(Long artistId, LocalDateTime scheduledAt);
}