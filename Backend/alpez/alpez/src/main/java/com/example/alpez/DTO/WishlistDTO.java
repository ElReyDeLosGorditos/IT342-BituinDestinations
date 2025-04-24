package com.example.alpez.DTO;

import java.time.LocalDateTime;

public class WishlistDTO {
    private Long id;
    private Integer userId;
    private Integer tourPackageId;
    private LocalDateTime addedAt;

    public WishlistDTO() {}

    public WishlistDTO(Long id, Integer userId, Integer tourPackageId, LocalDateTime addedAt) {
        this.id = id;
        this.userId = userId;
        this.tourPackageId = tourPackageId;
        this.addedAt = addedAt;
    }

    public Long getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getTourPackageId() {
        return tourPackageId;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setTourPackageId(Integer tourPackageId) {
        this.tourPackageId = tourPackageId;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}