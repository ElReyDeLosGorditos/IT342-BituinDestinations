package com.example.alpez.Service;

import com.example.alpez.Entity.WishlistEntity;
import com.example.alpez.Repo.WishListRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishListService {

    @Autowired
    private WishListRepo wishlistRepository;

    // Create
    public WishlistEntity createWishlist(WishlistEntity wishlist) {
        return wishlistRepository.save(wishlist);
    }

    // Read all
    public List<WishlistEntity> getAllWishlists() {
        return wishlistRepository.findAll();
    }

    // Read by ID
    public Optional<WishlistEntity> getWishlistById(Long id) {
        return wishlistRepository.findById(id);
    }

    // Update
    public WishlistEntity updateWishlist(Long id, WishlistEntity updated) {
        return wishlistRepository.findById(id).map(existing -> {
            existing.setAddedAt(updated.getAddedAt());
            existing.setUser(updated.getUser());
            existing.setTourPackage(updated.getTourPackage());
            return wishlistRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    public boolean deleteWishlist(Long id) {
        if (wishlistRepository.existsById(id)) {
            wishlistRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
