package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.ConsentForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConsentFormRepository extends JpaRepository<ConsentForm, Long> {
    Optional<ConsentForm> findByClientId(Long clientId);
    boolean existsByClientId(Long clientId);
}