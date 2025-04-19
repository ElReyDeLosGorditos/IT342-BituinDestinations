package com.example.alpez.Repo;

import com.example.alpez.Entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByUser_UserId(int userId); // Using 'userId' from your UserEntity
    List<ReviewEntity> findByTourPackage_Id(Long tourPackageId);
    List<ReviewEntity> findByRating(Integer rating);
    List<ReviewEntity> findByRatingGreaterThanEqual(Integer rating);
    List<ReviewEntity> findByRatingLessThanEqual(Integer rating);
    List<ReviewEntity> findByReviewDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
