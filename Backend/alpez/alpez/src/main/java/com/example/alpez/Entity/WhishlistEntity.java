package com.example.alpez.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class WhishlistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime addedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "tour_package_id")
    private TourPackageEntity tourPackage;
}
