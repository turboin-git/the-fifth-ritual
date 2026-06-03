package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.TattooDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TattooDesignRepository extends JpaRepository<TattooDesign, Long> {
    List<TattooDesign> findByStyle(String style);
    List<TattooDesign> findByArtistId(Long artistId);
}