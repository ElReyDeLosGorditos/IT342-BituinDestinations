package com.example.alpez.Controller;

import com.example.alpez.Entity.BookingEntity;
import com.example.alpez.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/save")
    public BookingEntity createBooking(@RequestBody BookingEntity booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/getAll")
    public List<BookingEntity> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{bookingId}")
    public BookingEntity getBookingById(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId).orElse(null);
    }

    @PutMapping("/update/{bookingId}")
    public BookingEntity updateBooking(@PathVariable Long bookingId, @RequestBody BookingEntity updatedBooking) {
        return bookingService.updateBooking(bookingId, updatedBooking);
    }

    @DeleteMapping("/delete/{bookingId}")
    public String deleteBooking(@PathVariable Long bookingId) {
        boolean deleted = bookingService.deleteBooking(bookingId);
        if (deleted) {
            return "Booking deleted successfully.";
        }
        return "Booking not found.";
    }
}
