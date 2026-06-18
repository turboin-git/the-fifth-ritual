package com.thefifthritual.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type = Type.DEPOSIT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gateway gateway;

    @Enumerated(EnumType.STRING)
    private Method method;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "pidx")
    private String pidx;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public enum Type { DEPOSIT, FULL }
    public enum Status { PENDING, SUCCESS, FAILED, REFUNDED }
    public enum Gateway { KHALTI, ESEWA, CASH }
    public enum Method { CASH, ESEWA, KHALTI }
}