package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tour_package")
public class TourPackageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "duration")
    private String duration;

    @Column(name = "available_slots")
    private Integer availableSlots;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Many-to-one: TourPackage belongs to one Destination
    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private DestinationEntity destination;

    // One-to-many: TourPackage has many bookings
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL)
    private List<BookingEntity> bookings;

    // One-to-many: TourPackage has many reviews
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL)
    private List<ReviewEntity> reviews;

    // One-to-many: TourPackage has many wishlists
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL)
    private List<WishlistEntity> wishlists;

    public TourPackageEntity() {}

    // Constructor without lists
    public TourPackageEntity(int id, String title, String description, BigDecimal price, String duration, Integer availableSlots, LocalDateTime createdAt, DestinationEntity destination) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.availableSlots = availableSlots;
        this.createdAt = createdAt;
        this.destination = destination;
    }

    // Getters and setters

    public int getPackageId() {
        return id;
    }

    public void setPackageId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(Integer availableSlots) {
        this.availableSlots = availableSlots;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public DestinationEntity getDestination() {
        return destination;
    }

    public void setDestination(DestinationEntity destination) {
        this.destination = destination;
    }

    public List<BookingEntity> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingEntity> bookings) {
        this.bookings = bookings;
    }

    public List<ReviewEntity> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewEntity> reviews) {
        this.reviews = reviews;
    }

    public List<WishlistEntity> getWishlists() {
        return wishlists;
    }

    public void setWishlists(List<WishlistEntity> wishlists) {
        this.wishlists = wishlists;
    }
}
