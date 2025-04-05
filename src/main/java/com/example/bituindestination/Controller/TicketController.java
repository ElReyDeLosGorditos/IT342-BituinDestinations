package com.example.bituindestination.Controller;

import com.example.bituindestination.Entity.TicketEntity;
import com.example.bituindestination.Service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
