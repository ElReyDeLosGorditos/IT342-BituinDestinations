package com.example.alpez.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double paymentAmount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String paymentStatus;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private BookingEntity booking;
}
