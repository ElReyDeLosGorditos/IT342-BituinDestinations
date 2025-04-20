package com.example.alpez.Repo;

import com.example.alpez.Entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepo extends JpaRepository<BookingEntity, Long> {
}
