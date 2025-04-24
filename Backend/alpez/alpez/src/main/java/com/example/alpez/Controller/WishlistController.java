package com.example.alpez.Controller;

import com.example.alpez.DTO.WishlistDTO;
import com.example.alpez.Service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public List<WishlistDTO> getWishlist(@PathVariable Integer userId) {
        return wishlistService.getWishlistByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<WishlistDTO> addToWishlist(@RequestBody WishlistDTO dto) {
        return ResponseEntity.ok(wishlistService.addToWishlist(dto));
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromWishlist(
            @RequestParam Integer userId,
            @RequestParam Integer tourPackageId) {
        wishlistService.removeFromWishlist(userId, tourPackageId);
        return ResponseEntity.noContent().build();
    }
}