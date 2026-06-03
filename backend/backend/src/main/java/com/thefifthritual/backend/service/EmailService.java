package com.thefifthritual.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to The Fifth Ritual 🖋️");
            helper.setText(buildWelcomeEmail(name), true);

            mailSender.send(message);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmationEmail(String toEmail, String clientName,
                                             String artistName, String date,
                                             String timeSlot) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed — The Fifth Ritual 🖋️");
            helper.setText(buildBookingEmail(clientName, artistName, date, timeSlot), true);

            mailSender.send(message);
            log.info("Booking confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendAppointmentCancellationEmail(String toEmail, String clientName,
                                                 String date) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Appointment Cancelled — The Fifth Ritual");
            helper.setText(buildCancellationEmail(clientName, date), true);

            mailSender.send(message);
            log.info("Cancellation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send cancellation email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String name, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Your OTP — The Fifth Ritual");
            helper.setText(buildOtpEmail(name, otp), true);

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ===== EMAIL TEMPLATES =====

    private String buildWelcomeEmail(String name) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="background:#000;color:#fff;font-family:serif;padding:40px;max-width:500px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:30px;">
                    <h1 style="color:#7c3aed;font-size:2rem;">The Fifth Ritual</h1>
                    <p style="color:#9ca3af;">Tattoo Studio Management</p>
                </div>
                <div style="background:#111;border-radius:16px;padding:30px;border:1px solid #333;">
                    <h2 style="color:#fff;margin-bottom:10px;">Welcome, %s! 🖋️</h2>
                    <p style="color:#9ca3af;line-height:1.6;">
                        You have successfully joined The Fifth Ritual.
                        Your journey into the art of tattooing begins here.
                    </p>
                    <div style="margin:25px 0;padding:20px;background:#1a1a1a;border-radius:12px;border-left:4px solid #7c3aed;">
                        <p style="color:#fff;margin:0;">Start by browsing our Flash Collection or booking your first session with one of our resident artists.</p>
                    </div>
                    <a href="http://localhost:5173/catalog"
                       style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;">
                        Browse Flash Collection →
                    </a>
                </div>
                <p style="color:#4b5563;text-align:center;margin-top:20px;font-size:12px;">
                    © 2024 The Fifth Ritual. All rights reserved.
                </p>
            </body>
            </html>
            """.formatted(name);
    }

    private String buildBookingEmail(String clientName, String artistName,
                                     String date, String timeSlot) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="background:#000;color:#fff;font-family:serif;padding:40px;max-width:500px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:30px;">
                    <h1 style="color:#7c3aed;font-size:2rem;">The Fifth Ritual</h1>
                </div>
                <div style="background:#111;border-radius:16px;padding:30px;border:1px solid #333;">
                    <h2 style="color:#fff;margin-bottom:10px;">Booking Confirmed! ✅</h2>
                    <p style="color:#9ca3af;">Hey %s, your appointment has been confirmed.</p>

                    <div style="margin:25px 0;padding:20px;background:#1a1a1a;border-radius:12px;">
                        <table style="width:100%%;">
                            <tr>
                                <td style="color:#9ca3af;padding:8px 0;">Artist</td>
                                <td style="color:#fff;font-weight:bold;text-align:right;">%s</td>
                            </tr>
                            <tr>
                                <td style="color:#9ca3af;padding:8px 0;">Date</td>
                                <td style="color:#fff;font-weight:bold;text-align:right;">%s</td>
                            </tr>
                            <tr>
                                <td style="color:#9ca3af;padding:8px 0;">Time</td>
                                <td style="color:#fff;font-weight:bold;text-align:right;">%s</td>
                            </tr>
                        </table>
                    </div>

                    <div style="padding:15px;background:#1a0a2e;border-radius:12px;border:1px solid #7c3aed;">
                        <p style="color:#c4b5fd;margin:0;font-size:14px;">
                            📋 Please arrive 10 minutes early and avoid alcohol 24 hours before your session.
                        </p>
                    </div>
                </div>
                <p style="color:#4b5563;text-align:center;margin-top:20px;font-size:12px;">
                    © 2024 The Fifth Ritual. All rights reserved.
                </p>
            </body>
            </html>
            """.formatted(clientName, artistName, date, timeSlot);
    }

    private String buildCancellationEmail(String clientName, String date) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="background:#000;color:#fff;font-family:serif;padding:40px;max-width:500px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:30px;">
                    <h1 style="color:#7c3aed;font-size:2rem;">The Fifth Ritual</h1>
                </div>
                <div style="background:#111;border-radius:16px;padding:30px;border:1px solid #333;">
                    <h2 style="color:#fff;margin-bottom:10px;">Appointment Cancelled</h2>
                    <p style="color:#9ca3af;">Hey %s, your appointment on %s has been cancelled.</p>
                    <a href="http://localhost:5173/book"
                       style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;margin-top:20px;">
                        Book Again →
                    </a>
                </div>
            </body>
            </html>
            """.formatted(clientName, date);
    }

    private String buildOtpEmail(String name, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="background:#000;color:#fff;font-family:serif;padding:40px;max-width:500px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:30px;">
                    <h1 style="color:#7c3aed;font-size:2rem;">The Fifth Ritual</h1>
                </div>
                <div style="background:#111;border-radius:16px;padding:30px;border:1px solid #333;">
                    <h2 style="color:#fff;margin-bottom:10px;">Your OTP Code</h2>
                    <p style="color:#9ca3af;">Hey %s, here is your one-time password:</p>
                    <div style="text-align:center;margin:25px 0;">
                        <span style="background:#7c3aed;color:#fff;font-size:2.5rem;font-weight:bold;padding:20px 40px;border-radius:16px;letter-spacing:8px;">
                            %s
                        </span>
                    </div>
                    <p style="color:#9ca3af;font-size:14px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
                </div>
            </body>
            </html>
            """.formatted(name, otp);
    }
}