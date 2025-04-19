package com.example.alpez.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class EnquiryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "tour_package_id")
    private TourPackageEntity tourPackage;
}
