package com.example.alpez.DTO;

import java.time.LocalDate;

public class BookingDTO {

    private LocalDate travelDate;
    private Integer numOfTravelers;
    private Double totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    private Integer userId;
    private Integer tourPackageId;

    // Getters and Setters

    public LocalDate getTravelDate() { return travelDate; }

    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public Integer getNumOfTravelers() { return numOfTravelers; }

    public void setNumOfTravelers(Integer numOfTravelers) { this.numOfTravelers = numOfTravelers; }

    public Double getTotalPrice() { return totalPrice; }

    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getPaymentMethod() { return paymentMethod; }

    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }

    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getBookingStatus() { return bookingStatus; }

    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public Integer getUserId() { return userId; }

    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getTourPackageId() { return tourPackageId; }

    public void setTourPackageId(Integer tourPackageId) { this.tourPackageId = tourPackageId; }
}