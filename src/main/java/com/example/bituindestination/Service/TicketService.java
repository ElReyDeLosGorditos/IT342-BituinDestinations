package com.example.bituindestination.Service;

import com.example.it342bituindestination.Entity.TicketEntity;
import com.example.it342bituindestination.Entity.TourPackageEntity;
import com.example.it342bituindestination.Entity.UserEntity;
import com.example.it342bituindestination.Repo.TicketRepo;
import com.example.it342bituindestination.Repo.TourPackageRepo;
import com.example.it342bituindestination.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    @Autowired
    private TicketRepo ticketRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private TourPackageRepo tourPackageRepo;

    //CREATE
    public TicketEntity saveTicket(TicketEntity ticket) {
        UserEntity user = userRepo.findById(ticket.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + ticket.getUser().getUserId()));
        TourPackageEntity tour = tourPackageRepo.findById(ticket.getTourPackage().getPackageId())
                .orElseThrow(() -> new RuntimeException("Tour Package not found with ID: " + ticket.getTourPackage().getPackageId()));
        ticket.setUserEntity(user);
        ticket.setTourPackageEntity(tour);
        return ticketRepo.save(ticket);
    }

    //READ
    public List<TicketEntity> getAllTicket(){
        return ticketRepo.findAll();
    }
    public Optional<TicketEntity> getTicketByTicketId(int ticketId) {
        return ticketRepo.findById(ticketId);
    }

    //UPDATE
    public TicketEntity updateTicket(int ticketId, TicketEntity updateTicket) {
        TicketEntity ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Reservation " + ticketId + " not found!"));


        ticket.setTicketType(updateTicket.getTicketType());
        ticket.setPrice(updateTicket.getPrice());
        ticket.setPurchaseTime(updateTicket.getPurchaseTime());
        return ticketRepo.save(ticket);
    }

    //DELETE
    public String deleteTicket(int ticketId) {
        Optional<TicketEntity> ticket = ticketRepo.findById(ticketId);
        if (ticket.isPresent()) {
            ticketRepo.deleteById(ticketId);
            return "Ticket has been successfully deleted!";
        } else {
            return "Ticket with ID " + ticketId + " not found!";
        }
    }
}
