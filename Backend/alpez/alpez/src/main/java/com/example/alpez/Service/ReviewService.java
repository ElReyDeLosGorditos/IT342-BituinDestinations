package com.example.alpez.Service;

import com.example.alpez.DTO.ReviewDTO;
import com.example.alpez.Entity.Review;
import com.example.alpez.Entity.TourPackage;
import com.example.alpez.Entity.UserEntity;
import com.example.alpez.Repo.ReviewRepo;
import com.example.alpez.Repo.TourPackageRepo;
import com.example.alpez.Repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepo reviewRepo;
    private final UserRepo userRepo;
    private final TourPackageRepo tourPackageRepo;

    public ReviewService(ReviewRepo reviewRepo, UserRepo userRepo, TourPackageRepo tourPackageRepo) {
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
        this.tourPackageRepo = tourPackageRepo;
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepo.findAll().stream().map(this::convertToDTO).toList();
    }

    public Optional<ReviewDTO> getReviewById(Long id) {
        return reviewRepo.findById(id).map(this::convertToDTO);
    }

    public ReviewDTO saveReview(ReviewDTO dto) {
        UserEntity user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TourPackage tourPackage = tourPackageRepo.findById(dto.getTourPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Tour package not found"));

        Review review = new Review(dto.getRating(), dto.getComment(), user, tourPackage);
        Review saved = reviewRepo.save(review);
        return convertToDTO(saved);
    }

    public void deleteReview(Long id) {
        reviewRepo.deleteById(id);
    }

    public List<ReviewDTO> getReviewsByTourPackageId(Integer tourPackageId) {
        return reviewRepo.findByTourPackageId(tourPackageId).stream().map(this::convertToDTO).toList();
    }

    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepo.findByUser_UserId(userId).stream().map(this::convertToDTO).toList();
    }

    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate(),
                review.getUser().getUserId(),
                review.getUser().getName(),
                review.getTourPackage().getId()
        );
    }
}