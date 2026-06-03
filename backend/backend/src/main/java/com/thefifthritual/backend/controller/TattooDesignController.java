package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.entity.TattooDesign;
import com.thefifthritual.backend.service.TattooDesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class TattooDesignController {

    private final TattooDesignService tattooDesignService;

    // Get all designs (public)
    @GetMapping
    public ResponseEntity<List<TattooDesign>> getAllDesigns() {
        return ResponseEntity.ok(tattooDesignService.getAllDesigns());
    }

    // Get designs by style
    @GetMapping("/style/{style}")
    public ResponseEntity<List<TattooDesign>> getByStyle(@PathVariable String style) {
        return ResponseEntity.ok(tattooDesignService.getDesignsByStyle(style));
    }

    // Get designs by artist
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<TattooDesign>> getByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(tattooDesignService.getDesignsByArtist(artistId));
    }

    // Create design with image upload (Artist only)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<TattooDesign> createDesign(
            @RequestParam Long artistId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String style,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) MultipartFile image) {

        TattooDesign design = tattooDesignService.createDesign(
                artistId, categoryId, title, description, style, size, image);
        return ResponseEntity.ok(design);
    }

    // Delete design
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(@PathVariable Long id) {
        tattooDesignService.deleteDesign(id);
        return ResponseEntity.noContent().build();
    }
}