package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByUserId(Long userId);
    List<Artist> findByIsApprovedTrue();
}