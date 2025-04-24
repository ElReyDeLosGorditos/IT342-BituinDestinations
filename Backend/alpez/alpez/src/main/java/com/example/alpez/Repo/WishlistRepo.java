package com.example.alpez.Repo;

import com.example.alpez.Entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserUserId(Integer userId);
    boolean existsByUserUserIdAndTourPackageId(Integer userId, Integer tourPackageId);
    void deleteByUserUserIdAndTourPackageId(Integer userId, Integer tourPackageId);
}