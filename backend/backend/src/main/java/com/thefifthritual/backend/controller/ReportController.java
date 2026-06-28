package com.thefifthritual.backend.controller;

import com.thefifthritual.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/appointments/pdf")
    public ResponseEntity<byte[]> downloadAppointmentReport() {
        try {
            byte[] pdf = reportService.generateAppointmentReport();
            return buildPdfResponse(pdf, "appointment_report.pdf");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/artist/{artistId}/pdf")
    public ResponseEntity<byte[]> downloadArtistReport(@PathVariable Long artistId) {
        try {
            byte[] pdf = reportService.generateArtistReport(artistId);
            return buildPdfResponse(pdf, "artist_report_" + artistId + ".pdf");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/client/{clientId}/pdf")
    public ResponseEntity<byte[]> downloadClientReport(@PathVariable Long clientId) {
        try {
            byte[] pdf = reportService.generateClientReport(clientId);
            return buildPdfResponse(pdf, "client_report_" + clientId + ".pdf");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private ResponseEntity<byte[]> buildPdfResponse(byte[] pdf, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
