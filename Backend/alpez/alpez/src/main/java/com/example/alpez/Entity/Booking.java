package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate travelDate;

    @Column(nullable = false)
    private Integer numOfTravelers;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private String bookingStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tour_package_id")
    private TourPackage tourPackage;

    // Placeholder for future Payment entity implementation
    // @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    // private Payment payment;

    public Booking() {}

    public Booking(LocalDate travelDate, Integer numOfTravelers, Double totalPrice, String paymentMethod,
                   String bookingStatus, UserEntity user, TourPackage tourPackage) {
        this.travelDate = travelDate;
        this.numOfTravelers = numOfTravelers;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.bookingStatus = bookingStatus;
        this.user = user;
        this.tourPackage = tourPackage;
    }

    public Long getId() {
        return id;
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

    public TourPackage getTourPackage() {
        return tourPackage;
    }

    public void setTourPackage(TourPackage tourPackage) {
        this.tourPackage = tourPackage;
    }

    // Uncomment when Payment is implemented
//    public Payment getPayment() {
//        return payment;
//    }
//
//    public void setPayment(Payment payment) {
//        this.payment = payment;
//        if (payment != null) {
//            payment.setBooking(this);
//        }
//    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", travelDate=" + travelDate +
                ", numOfTravelers=" + numOfTravelers +
                ", totalPrice=" + totalPrice +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", bookingStatus='" + bookingStatus + '\'' +
                ", createdAt=" + createdAt +
                ", user=" + (user != null ? user.getUserId() : null) +
                ", tourPackage=" + (tourPackage != null ? tourPackage.getId() : null) +
                '}';
    }
}