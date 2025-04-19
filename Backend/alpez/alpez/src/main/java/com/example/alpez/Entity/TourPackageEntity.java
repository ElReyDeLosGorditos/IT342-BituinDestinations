package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class TourPackageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private double price;
    private String duration;
    private Integer availableSlots;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private DestinationEntity destination;

    @OneToMany(mappedBy = "tourPackage")
    private List<BookingEntity> bookings;

    @OneToMany(mappedBy = "tourPackage")
    private List<ReviewEntity> reviews;

    @OneToMany(mappedBy = "tourPackage")
    private List<WhishlistEntity> wishlists;
}
