package com.example.alpez.Repo;

import com.example.alpez.Entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentEntity, Long> {
    List<PaymentEntity> findByBooking_Id(Long bookingId);
    List<PaymentEntity> findByPaymentMethod(String paymentMethod);
    List<PaymentEntity> findByPaymentStatus(String paymentStatus);
    List<PaymentEntity> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
