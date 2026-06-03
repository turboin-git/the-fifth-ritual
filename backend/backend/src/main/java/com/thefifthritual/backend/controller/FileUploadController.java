package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileStorageService fileStorageService;

    // Upload tattoo design image
    @PostMapping("/upload/design")
    public ResponseEntity<Map<String, String>> uploadDesignImage(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select a file"));
        }

        if (!fileStorageService.isValidImageFile(file)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed (JPG, PNG, GIF, WEBP)"));
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be less than 10MB"));
        }

        String fileUrl = fileStorageService.saveFile(file, "designs");
        log.info("Design image uploaded: {}", fileUrl);

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("message", "File uploaded successfully");
        return ResponseEntity.ok(response);
    }

    // Upload profile image
    @PostMapping("/upload/profile")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select a file"));
        }

        if (!fileStorageService.isValidImageFile(file)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed"));
        }

        String fileUrl = fileStorageService.saveFile(file, "profiles");
        log.info("Profile image uploaded: {}", fileUrl);

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("message", "Profile image uploaded successfully");
        return ResponseEntity.ok(response);
    }

    // Download/serve file
    @GetMapping("/download/{folder}/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String folder,
            @PathVariable String filename) {

        try {
            Path filePath = Paths.get("./uploads")
                    .resolve(folder)
                    .resolve(filename)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (filename.endsWith(".png")) {
                contentType = "image/png";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}