package com.example.alpez.Repo;

import com.example.alpez.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByTourPackageId(Integer tourPackageId);
    List<Review> findByUser_UserId(Long userId);
}
