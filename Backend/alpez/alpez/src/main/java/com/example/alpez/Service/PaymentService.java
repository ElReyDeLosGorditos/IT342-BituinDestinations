package com.example.alpez.Service;

import com.example.alpez.DTO.PaymentDTO;
import com.example.alpez.Entity.Payment;
import com.example.alpez.Repo.BookingRepo;
import com.example.alpez.Repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Transactional
    public Payment createPayment(PaymentDTO dto) {
        // First, find the booking
        var booking = bookingRepo.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if a payment already exists for this booking
        Optional<Payment> existingPayment = paymentRepo.findByBookingId(booking.getId());
        if (existingPayment.isPresent()) {
            // Update the existing payment
            Payment payment = existingPayment.get();
            payment.setPaymentAmount(dto.getPaymentAmount());
            payment.setPaymentMethod(dto.getPaymentMethod());
            payment.setPaymentStatus(dto.getPaymentStatus());
            payment.setPaymentDate(LocalDateTime.now());
            return paymentRepo.save(payment);
        }

        // Create and set up a new payment
        Payment payment = new Payment();
        payment.setPaymentAmount(dto.getPaymentAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setBooking(booking);

        // Save and return the payment
        return paymentRepo.save(payment);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepo.findById(id);
    }

    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        return paymentRepo.findByBookingId(bookingId);
    }

    @Transactional
    public Payment updatePayment(Long id, PaymentDTO dto) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (dto.getPaymentAmount() != null) {
            payment.setPaymentAmount(dto.getPaymentAmount());
        }
        if (dto.getPaymentMethod() != null) {
            payment.setPaymentMethod(dto.getPaymentMethod());
        }
        if (dto.getPaymentStatus() != null) {
            payment.setPaymentStatus(dto.getPaymentStatus());
        }
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepo.save(payment);
    }

    public boolean deletePayment(Long id) {
        Optional<Payment> payment = paymentRepo.findById(id);
        if (payment.isPresent()) {
            paymentRepo.delete(payment.get());
            return true;
        }
        return false;
    }
}