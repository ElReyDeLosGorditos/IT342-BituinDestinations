package com.example.alpez.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate travelDate;
    private Integer numOfTravelers;
    private double totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "tour_package_id")
    private TourPackageEntity tourPackage;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private PaymentEntity payment;
}
