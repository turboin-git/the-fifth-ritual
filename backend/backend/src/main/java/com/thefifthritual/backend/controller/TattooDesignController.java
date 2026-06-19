package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.entity.TattooDesign;
import com.thefifthritual.backend.service.TattooDesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class TattooDesignController {

    private final TattooDesignService tattooDesignService;

    @GetMapping
    public ResponseEntity<List<TattooDesign>> getAllDesigns() {
        return ResponseEntity.ok(tattooDesignService.getAllDesigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TattooDesign> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tattooDesignService.getById(id));
    }

    @GetMapping("/style/{style}")
    public ResponseEntity<List<TattooDesign>> getByStyle(@PathVariable String style) {
        return ResponseEntity.ok(tattooDesignService.getDesignsByStyle(style));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<TattooDesign>> getByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(tattooDesignService.getDesignsByArtist(artistId));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<TattooDesign> createDesign(
            @RequestParam Long artistId,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String style,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) BigDecimal durationHours,
            @RequestParam(required = false) MultipartFile image) {

        TattooDesign design = tattooDesignService.createDesign(
                artistId, title, description, style, size, theme, price, durationHours, image);
        return ResponseEntity.ok(design);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<TattooDesign> updateDesign(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) BigDecimal durationHours,
            @RequestParam(required = false) MultipartFile image) {

        TattooDesign design = tattooDesignService.updateDesign(
                id, title, description, style, size, theme, price, durationHours, image);
        return ResponseEntity.ok(design);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(@PathVariable Long id) {
        tattooDesignService.deleteDesign(id);
        return ResponseEntity.noContent().build();
    }
}