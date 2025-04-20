package com.example.alpez.Controller;

import com.example.alpez.Entity.WishlistEntity;
import com.example.alpez.Service.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/wishlist")
public class WishListController {

    @Autowired
    private WishListService wishlistService;

    @PostMapping("/save")
    public WishlistEntity createWishlist(@RequestBody WishlistEntity wishlist) {
        return wishlistService.createWishlist(wishlist);
    }

    @GetMapping("/getAll")
    public List<WishlistEntity> getAllWishlists() {
        return wishlistService.getAllWishlists();
    }

    @GetMapping("/{wishlistId}")
    public WishlistEntity getWishlistById(@PathVariable Long wishlistId) {
        return wishlistService.getWishlistById(wishlistId).orElse(null);
    }


    @PutMapping("/update/{wishlistId}")
    public WishlistEntity updateWishlist(@PathVariable Long wishlistId, @RequestBody WishlistEntity updatedWishlist) {
        return wishlistService.updateWishlist(wishlistId, updatedWishlist);
    }

    @DeleteMapping("/delete/{wishlistId}")
    public String deleteWishlist(@PathVariable Long wishlistId) {
        boolean deleted = wishlistService.deleteWishlist(wishlistId);
        if (deleted) {
            return "Wishlist deleted successfully.";
        }
        return "Wishlist not found.";
    }
}
