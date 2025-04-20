package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;

    @Column(name = "travel_date")
    private LocalDate travelDate;

    @Column(name = "num_of_travelers")
    private Integer numOfTravelers;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "booking_status")
    private String bookingStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Many-to-one: Booking belongs to a User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Many-to-one: Booking belongs to a TourPackage
    @ManyToOne
    @JoinColumn(name = "tour_package_id", nullable = false)
    private TourPackageEntity tourPackage;

    // One-to-one: Booking has one Payment
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private PaymentEntity payment;

    public BookingEntity() {}

    public BookingEntity(Long id, LocalDate travelDate, Integer numOfTravelers, Double totalPrice, String paymentMethod,
                         String paymentStatus, String bookingStatus, LocalDateTime createdAt,
                         UserEntity user, TourPackageEntity tourPackage) {
        this.id = id;
        this.travelDate = travelDate;
        this.numOfTravelers = numOfTravelers;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.bookingStatus = bookingStatus;
        this.createdAt = createdAt;
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

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public Integer getNumOfTravelers() {
        return numOfTravelers;
    }

    public void setNumOfTravelers(Integer numOfTravelers) {
        this.numOfTravelers = numOfTravelers;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }
}
