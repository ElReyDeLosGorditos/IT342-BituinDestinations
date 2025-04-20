package com.example.alpez.Repo;

import com.example.alpez.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepo extends JpaRepository<WishlistEntity, Long> {
}
