package com.example.alpez.DTO;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;
    private Integer userId;         // ← Changed from Long to Integer
    private Integer tourPackageId;

    public ReviewDTO() {}

    public ReviewDTO(Long id, Integer rating, String comment, LocalDateTime reviewDate, Integer userId, Integer tourPackageId) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.userId = userId;
        this.tourPackageId = tourPackageId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getTourPackageId() { return tourPackageId; }
    public void setTourPackageId(Integer tourPackageId) { this.tourPackageId = tourPackageId; }
}