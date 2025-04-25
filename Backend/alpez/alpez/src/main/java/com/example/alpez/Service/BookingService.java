package com.example.alpez.Service;

import com.example.alpez.DTO.BookingDTO;
import com.example.alpez.Entity.Booking;
import com.example.alpez.Repo.BookingRepo;
import com.example.alpez.Repo.TourPackageRepo;
import com.example.alpez.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepo userRepo; // Make sure this exists

    @Autowired
    private TourPackageRepo tourPackageRepo; // Make sure this exists

    public Booking createBooking(BookingDTO dto) {
        Booking booking = new Booking();

        booking.setTravelDate(dto.getTravelDate());
        booking.setNumOfTravelers(dto.getNumOfTravelers());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setPaymentMethod(dto.getPaymentMethod());
        booking.setPaymentStatus(dto.getPaymentStatus());
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
}