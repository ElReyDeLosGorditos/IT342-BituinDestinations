package com.example.alpez.Service;

import com.example.alpez.Entity.ReviewEntity;
import com.example.alpez.Repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepository;

    // Create
    public ReviewEntity createReview(ReviewEntity review) {
        return reviewRepository.save(review);
    }

    // Read all
    public List<ReviewEntity> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Read by ID
    public Optional<ReviewEntity> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // Update
    public ReviewEntity updateReview(Long id, ReviewEntity updated) {
        return reviewRepository.findById(id).map(existing -> {
            existing.setRating(updated.getRating());
            existing.setComment(updated.getComment());
            existing.setReviewDate(updated.getReviewDate());
            existing.setUser(updated.getUser());
            existing.setTourPackage(updated.getTourPackage());
            return reviewRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
