package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist")
public class WishlistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Long id;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    // Many-to-one: Many wishlists can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Many-to-one: Many wishlists can refer to one tour package
    @ManyToOne
    @JoinColumn(name = "tour_package_id", nullable = false)
    private TourPackageEntity tourPackage;

    public WishlistEntity() {}

    public WishlistEntity(Long id, LocalDateTime addedAt, UserEntity user, TourPackageEntity tourPackage) {
        this.id = id;
        this.addedAt = addedAt;
        this.user = user;
        this.tourPackage = tourPackage;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public TourPackageEntity getTourPackage() {
        return tourPackage;
    }

    public void setTourPackage(TourPackageEntity tourPackage) {
        this.tourPackage = tourPackage;
    }
}
