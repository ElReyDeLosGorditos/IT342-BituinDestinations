package com.example.alpez.Service;

import com.example.alpez.Entity.BookingEntity;
import com.example.alpez.Repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepository;

    // Create
    public BookingEntity createBooking(BookingEntity booking) {
        return bookingRepository.save(booking);
    }

    // Read all
    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Read by ID
    public Optional<BookingEntity> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Update
    public BookingEntity updateBooking(Long id, BookingEntity updated) {
        return bookingRepository.findById(id).map(existing -> {
            existing.setTravelDate(updated.getTravelDate());
            existing.setNumOfTravelers(updated.getNumOfTravelers());
            existing.setTotalPrice(updated.getTotalPrice());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setPaymentStatus(updated.getPaymentStatus());
            existing.setBookingStatus(updated.getBookingStatus());
            existing.setCreatedAt(updated.getCreatedAt());
            existing.setUser(updated.getUser());
            existing.setTourPackage(updated.getTourPackage());
            existing.setPayment(updated.getPayment());
            return bookingRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
