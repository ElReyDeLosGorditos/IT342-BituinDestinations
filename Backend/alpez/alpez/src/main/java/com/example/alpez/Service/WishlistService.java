package com.example.alpez.Service;

import com.example.alpez.DTO.WishlistDTO;
import com.example.alpez.Entity.TourPackage;
import com.example.alpez.Entity.UserEntity;
import com.example.alpez.Entity.Wishlist;
import com.example.alpez.Repo.TourPackageRepo;
import com.example.alpez.Repo.UserRepo;
import com.example.alpez.Repo.WishlistRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepo wishlistRepo;
    private final UserRepo userRepo;
    private final TourPackageRepo tourPackageRepo;

    public WishlistService(WishlistRepo wishlistRepo, UserRepo userRepo, TourPackageRepo tourPackageRepo) {
        this.wishlistRepo = wishlistRepo;
        this.userRepo = userRepo;
        this.tourPackageRepo = tourPackageRepo;
    }

    public List<WishlistDTO> getWishlistByUserId(Integer userId) {
        return wishlistRepo.findByUserUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public WishlistDTO addToWishlist(WishlistDTO dto) {
        if (wishlistRepo.existsByUserUserIdAndTourPackageId(dto.getUserId(), dto.getTourPackageId())) {
            throw new IllegalArgumentException("Already exists in wishlist");
        }

        UserEntity user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TourPackage tour = tourPackageRepo.findById(dto.getTourPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Tour package not found"));

        Wishlist wishlist = new Wishlist(user, tour);
        return toDTO(wishlistRepo.save(wishlist));
    }

    public void removeFromWishlist(Integer userId, Integer tourPackageId) {
        wishlistRepo.deleteByUserUserIdAndTourPackageId(userId, tourPackageId);
    }

    private WishlistDTO toDTO(Wishlist w) {
        return new WishlistDTO(w.getId(), w.getUser().getUserId(), w.getTourPackage().getId(), w.getAddedAt());
    }
}