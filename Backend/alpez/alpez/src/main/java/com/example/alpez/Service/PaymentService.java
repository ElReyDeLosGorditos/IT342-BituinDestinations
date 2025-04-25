package com.example.alpez.Service;

import com.example.alpez.DTO.PaymentDTO;
import com.example.alpez.Entity.Payment;
import com.example.alpez.Repo.BookingRepo;
import com.example.alpez.Repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private BookingRepo bookingRepo; // Make sure this exists

    public Payment createPayment(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setPaymentAmount(dto.getPaymentAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setPaymentDate(LocalDateTime.now());

        bookingRepo.findById(dto.getBookingId()).ifPresent(payment::setBooking);

        return paymentRepo.save(payment);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepo.findById(id);
    }

    public boolean deletePayment(Long id) {
        Optional<Payment> payment = paymentRepo.findById(id);
        if (payment.isPresent()) {
            paymentRepo.delete(payment.get());
            return true;
        }
        return false;  // Return false if the payment is not found
    }
}