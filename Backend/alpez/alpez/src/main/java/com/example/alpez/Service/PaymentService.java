package com.example.alpez.Service;

import com.example.alpez.Entity.PaymentEntity;
import com.example.alpez.Repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepository;

    // Create
    public PaymentEntity createPayment(PaymentEntity payment) {
        return paymentRepository.save(payment);
    }

    // Read all
    public List<PaymentEntity> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Read by ID
    public Optional<PaymentEntity> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    // Update
    public PaymentEntity updatePayment(Long id, PaymentEntity updated) {
        return paymentRepository.findById(id).map(existing -> {
            existing.setPaymentAmount(updated.getPaymentAmount());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setPaymentDate(updated.getPaymentDate());
            existing.setPaymentStatus(updated.getPaymentStatus());
            existing.setBooking(updated.getBooking());
            return paymentRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    public boolean deletePayment(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
