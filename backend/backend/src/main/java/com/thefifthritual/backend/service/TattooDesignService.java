package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.TattooDesign;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.CategoryRepository;
import com.thefifthritual.backend.repository.TattooDesignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TattooDesignService {

    private final TattooDesignRepository tattooDesignRepository;
    private final ArtistRepository artistRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public List<TattooDesign> getAllDesigns() {
        return tattooDesignRepository.findAll();
    }

    public List<TattooDesign> getDesignsByStyle(String style) {
        return tattooDesignRepository.findByStyle(style);
    }

    public List<TattooDesign> getDesignsByArtist(Long artistId) {
        return tattooDesignRepository.findByArtistId(artistId);
    }

    public TattooDesign createDesign(Long artistId, Long categoryId,
                                     String title, String description,
                                     String style, String size,
                                     MultipartFile imageFile) {
        TattooDesign design = new TattooDesign();

        artistRepository.findById(artistId).ifPresent(design::setArtist);
        if (categoryId != null) {
            categoryRepository.findById(categoryId).ifPresent(design::setCategory);
        }

        design.setTitle(title);
        design.setDescription(description);
        design.setStyle(style);
        design.setSize(size);

        // Upload image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(imageFile, "designs");
            design.setImageUrl(imageUrl);
            log.info("Design image saved: {}", imageUrl);
        }

        return tattooDesignRepository.save(design);
    }

    public TattooDesign updateDesign(Long id, MultipartFile imageFile,
                                     String title, String description) {
        TattooDesign design = tattooDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));

        if (title != null) design.setTitle(title);
        if (description != null) design.setDescription(description);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image
            if (design.getImageUrl() != null) {
                fileStorageService.deleteFile(design.getImageUrl());
            }
            // Save new image
            String imageUrl = fileStorageService.saveFile(imageFile, "designs");
            design.setImageUrl(imageUrl);
        }

        return tattooDesignRepository.save(design);
    }

    public void deleteDesign(Long id) {
        TattooDesign design = tattooDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));
        // Delete image file
        if (design.getImageUrl() != null) {
            fileStorageService.deleteFile(design.getImageUrl());
        }
        tattooDesignRepository.delete(design);
    }
}