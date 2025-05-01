package com.example.alpez.Service;

import com.example.alpez.DTO.BookingDTO;
import com.example.alpez.Entity.Booking;
import com.example.alpez.Repo.BookingRepo;
import com.example.alpez.Repo.TourPackageRepo;
import com.example.alpez.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TourPackageRepo tourPackageRepo;

    public Booking createBooking(BookingDTO dto) {
        Booking booking = new Booking();

        booking.setTravelDate(dto.getTravelDate());
        booking.setNumOfTravelers(dto.getNumOfTravelers());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setPaymentMethod(dto.getPaymentMethod());
        booking.setBookingStatus(dto.getBookingStatus());

        userRepo.findById(dto.getUserId()).ifPresent(booking::setUser);
        tourPackageRepo.findById(dto.getTourPackageId()).ifPresent(booking::setTourPackage);

        return bookingRepo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }

    public void deleteBooking(Long id) {
        bookingRepo.deleteById(id);
    }

    public Booking updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBookingStatus(newStatus);
        return bookingRepo.save(booking);
    }

    public List<Booking> getBookingsByUserId(Integer userId) {
        return bookingRepo.findByUser_UserId(userId);
    }

    @Transactional
    public Booking updateBooking(Long id, BookingDTO dto) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (dto.getTravelDate() != null) {
            booking.setTravelDate(dto.getTravelDate());
        }
        if (dto.getNumOfTravelers() != null) {
            booking.setNumOfTravelers(dto.getNumOfTravelers());
        }
        if (dto.getTotalPrice() != null) {
            booking.setTotalPrice(dto.getTotalPrice());
        }
        if (dto.getPaymentMethod() != null) {
            booking.setPaymentMethod(dto.getPaymentMethod());
        }
        if (dto.getBookingStatus() != null) {
            booking.setBookingStatus(dto.getBookingStatus());
        }

        return bookingRepo.save(booking);
    }
}