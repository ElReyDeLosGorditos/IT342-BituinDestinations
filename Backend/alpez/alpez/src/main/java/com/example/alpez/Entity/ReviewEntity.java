package com.example.alpez.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "tour_package_id")
    private TourPackageEntity tourPackage;
}
