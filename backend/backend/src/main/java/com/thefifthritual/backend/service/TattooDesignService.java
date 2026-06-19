package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.TattooDesign;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.TattooDesignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TattooDesignService {

    private final TattooDesignRepository tattooDesignRepository;
    private final ArtistRepository artistRepository;
    private final FileStorageService fileStorageService;

    public List<TattooDesign> getAllDesigns() {
        return tattooDesignRepository.findAll();
    }

    public TattooDesign getById(Long id) {
        return tattooDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));
    }

    public List<TattooDesign> getDesignsByStyle(String style) {
        return tattooDesignRepository.findByStyle(style);
    }

    public List<TattooDesign> getDesignsByArtist(Long artistId) {
        return tattooDesignRepository.findByArtistId(artistId);
    }

    public TattooDesign createDesign(Long artistId, String title, String description,
                                     String style, String size, String theme,
                                     BigDecimal price, BigDecimal durationHours,
                                     MultipartFile imageFile) {
        TattooDesign design = new TattooDesign();

        artistRepository.findById(artistId).ifPresent(design::setArtist);

        design.setTitle(title);
        design.setDescription(description);
        design.setStyle(style);
        design.setSize(size);
        design.setTheme(theme);
        design.setPrice(price != null ? price : BigDecimal.ZERO);
        design.setDurationHours(durationHours != null ? durationHours : BigDecimal.ONE);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(imageFile, "designs");
            design.setImageUrl(imageUrl);
            log.info("Design image saved: {}", imageUrl);
        }

        return tattooDesignRepository.save(design);
    }

    public TattooDesign updateDesign(Long id, String title, String description,
                                     String style, String size, String theme,
                                     BigDecimal price, BigDecimal durationHours,
                                     MultipartFile imageFile) {
        TattooDesign design = tattooDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));

        if (title != null) design.setTitle(title);
        if (description != null) design.setDescription(description);
        if (style != null) design.setStyle(style);
        if (size != null) design.setSize(size);
        if (theme != null) design.setTheme(theme);
        if (price != null) design.setPrice(price);
        if (durationHours != null) design.setDurationHours(durationHours);

        if (imageFile != null && !imageFile.isEmpty()) {
            if (design.getImageUrl() != null) {
                fileStorageService.deleteFile(design.getImageUrl());
            }
            String imageUrl = fileStorageService.saveFile(imageFile, "designs");
            design.setImageUrl(imageUrl);
        }

        return tattooDesignRepository.save(design);
    }

    public void deleteDesign(Long id) {
        TattooDesign design = tattooDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));
        if (design.getImageUrl() != null) {
            fileStorageService.deleteFile(design.getImageUrl());
        }
        tattooDesignRepository.delete(design);
    }
}