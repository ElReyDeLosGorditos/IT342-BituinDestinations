package com.example.alpez.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.alpez.Entity.TicketEntity;
import com.example.alpez.Service.TicketService;

@RestController
@RequestMapping("/ticket")
// @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TicketController {
    
    
    @Autowired
    private TicketService ticketService;

    // Check
    @GetMapping("/print")
    public String print() {
        return "Hello, Ticket! Test";
    }

    // Create
    @PostMapping("/save")
public TicketEntity saveTicket(@RequestBody TicketEntity ticket) {
        return ticketService.saveTicket(ticket);
}

    // Read
    @GetMapping("/getAll")
    public List<TicketEntity> getAllTickets() {
        return ticketService.getAllTicket();
    }
    // Update by ID
    @PutMapping("/update")
    public TicketEntity updateTicket(@RequestParam int Id, @RequestBody TicketEntity ticket) {
        return ticketService.updateTicket(Id, ticket);
    }

    @DeleteMapping("/delete/{ticketId}")
    public String deleteTicket(@PathVariable int id){
        return ticketService.deleteTicket(id);
    }
}