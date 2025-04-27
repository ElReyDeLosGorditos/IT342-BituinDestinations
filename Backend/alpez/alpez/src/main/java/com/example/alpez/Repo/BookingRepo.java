package com.example.alpez.Repo;

import com.example.alpez.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepo extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_UserId(Integer userId);
}
