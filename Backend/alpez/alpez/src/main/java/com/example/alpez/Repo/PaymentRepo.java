package com.example.alpez.Repo;

import com.example.alpez.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
}

