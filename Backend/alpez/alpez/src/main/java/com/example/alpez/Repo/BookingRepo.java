package com.example.alpez.Repo;

import com.example.alpez.Entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<BookingEntity, Long> {
    List<BookingEntity> findByUser_UserId(int userId); // Using 'userId' from your UserEntity
    List<BookingEntity> findByTourPackage_Id(Long tourPackageId);
    List<BookingEntity> findByTravelDate(LocalDate travelDate);
    List<BookingEntity> findByTravelDateBetween(LocalDate startDate, LocalDate endDate);
    List<BookingEntity> findByBookingStatus(String bookingStatus);
    List<BookingEntity> findByPaymentStatus(String paymentStatus);
    List<BookingEntity> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}