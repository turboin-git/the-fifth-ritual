package com.thefifthritual.backend.service;

import com.thefifthritual.backend.entity.Appointment;
import com.thefifthritual.backend.repository.AppointmentRepository;
import com.thefifthritual.backend.repository.ArtistRepository;
import com.thefifthritual.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final AppointmentRepository appointmentRepository;
    private final ArtistRepository artistRepository;
    private final ClientRepository clientRepository;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public byte[] generateAppointmentReport() throws JRException {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<Map<String, Object>> dataList = new ArrayList<>();

        for (Appointment appt : appointments) {
            Map<String, Object> row = new HashMap<>();
            row.put("clientName", appt.getClient() != null ? appt.getClient().getUser().getName() : "N/A");
            row.put("artistName", appt.getArtist() != null ? appt.getArtist().getUser().getName() : "N/A");
            row.put("scheduledAt", appt.getScheduledAt() != null ? appt.getScheduledAt().format(FORMATTER) : "N/A");
            row.put("status", appt.getStatus().name());
            row.put("designTitle", appt.getDesign() != null ? appt.getDesign().getTitle() : "Custom");
            dataList.add(row);
        }

        Map<String, Object> params = new HashMap<>();
        params.put("reportTitle", "All Appointments Report");
        params.put("generatedDate", java.time.LocalDate.now().toString());

        return buildPdf("appointment_report.jrxml", params, dataList);
    }

    public byte[] generateArtistReport(Long artistId) throws JRException {
        List<Appointment> appointments = appointmentRepository.findByArtistId(artistId);
        String artistName = artistRepository.findById(artistId)
                .map(a -> a.getUser().getName()).orElse("Unknown Artist");

        List<Map<String, Object>> dataList = new ArrayList<>();
        for (Appointment appt : appointments) {
            Map<String, Object> row = new HashMap<>();
            row.put("clientName", appt.getClient() != null ? appt.getClient().getUser().getName() : "N/A");
            row.put("scheduledAt", appt.getScheduledAt() != null ? appt.getScheduledAt().format(FORMATTER) : "N/A");
            row.put("status", appt.getStatus().name());
            row.put("designTitle", appt.getDesign() != null ? appt.getDesign().getTitle() : "Custom");
            dataList.add(row);
        }

        Map<String, Object> params = new HashMap<>();
        params.put("artistName", artistName);
        params.put("generatedDate", java.time.LocalDate.now().toString());
        params.put("totalBookings", dataList.size());

        return buildPdf("artist_report.jrxml", params, dataList);
    }

    public byte[] generateClientReport(Long clientId) throws JRException {
        List<Appointment> appointments = appointmentRepository.findByClientId(clientId);
        String clientName = clientRepository.findById(clientId)
                .map(c -> c.getUser().getName()).orElse("Unknown Client");

        List<Map<String, Object>> dataList = new ArrayList<>();
        for (Appointment appt : appointments) {
            Map<String, Object> row = new HashMap<>();
            row.put("artistName", appt.getArtist() != null ? appt.getArtist().getUser().getName() : "N/A");
            row.put("scheduledAt", appt.getScheduledAt() != null ? appt.getScheduledAt().format(FORMATTER) : "N/A");
            row.put("status", appt.getStatus().name());
            row.put("designTitle", appt.getDesign() != null ? appt.getDesign().getTitle() : "Custom");
            dataList.add(row);
        }

        Map<String, Object> params = new HashMap<>();
        params.put("clientName", clientName);
        params.put("generatedDate", java.time.LocalDate.now().toString());
        params.put("totalBookings", dataList.size());

        return buildPdf("client_report.jrxml", params, dataList);
    }

    private byte[] buildPdf(String templateName, Map<String, Object> params,
                            List<Map<String, Object>> dataList) throws JRException {
        try {
            InputStream template = new ClassPathResource(templateName).getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(template);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            log.error("Failed to generate report {}: {}", templateName, e.getMessage());
            throw new JRException("Report generation failed: " + e.getMessage());
        }
    }
}