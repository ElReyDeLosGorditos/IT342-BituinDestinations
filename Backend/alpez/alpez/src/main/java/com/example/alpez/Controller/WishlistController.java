package com.example.alpez.Controller;

import com.example.alpez.DTO.WishlistDTO;
import com.example.alpez.Service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "https://it-342-bituin-destinations.vercel.app")
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
        try {
            wishlistService.removeFromWishlist(userId, tourPackageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}