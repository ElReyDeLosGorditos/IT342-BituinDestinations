package com.example.alpez.DTO;

public class PaymentDTO {

    private Double paymentAmount;
    private String paymentMethod;
    private String paymentStatus;
    private Long bookingId;

    // Getters and Setters

    public Double getPaymentAmount() { return paymentAmount; }

    public void setPaymentAmount(Double paymentAmount) { this.paymentAmount = paymentAmount; }

    public String getPaymentMethod() { return paymentMethod; }

    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }

    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Long getBookingId() { return bookingId; }

    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
}