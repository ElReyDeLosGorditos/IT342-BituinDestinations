package com.example.alpez.Controller;

import com.example.alpez.Entity.ReviewEntity;
import com.example.alpez.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/save")
    public ReviewEntity createReview(@RequestBody ReviewEntity review) {
        return reviewService.createReview(review);
    }

    @GetMapping("/getAll")
    public List<ReviewEntity> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{reviewId}")
    public ReviewEntity getReviewById(@PathVariable Long reviewId) {
        return reviewService.getReviewById(reviewId).orElse(null);
    }

    @PutMapping("/update/{reviewId}")
    public ReviewEntity updateReview(@PathVariable Long reviewId, @RequestBody ReviewEntity updatedReview) {
        return reviewService.updateReview(reviewId, updatedReview);
    }

    @DeleteMapping("/delete/{reviewId}")
    public String deleteReview(@PathVariable Long reviewId) {
        boolean deleted = reviewService.deleteReview(reviewId);
        if (deleted) {
            return "Review deleted successfully.";
        }
        return "Review not found.";
    }
}
