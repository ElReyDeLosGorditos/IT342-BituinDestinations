package com.example.alpez.Controller;

import com.example.alpez.Entity.DestinationEntity;
import com.example.alpez.Service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/destination")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @PostMapping("/save")
    public DestinationEntity createDestination(@RequestBody DestinationEntity destination) {
        return destinationService.createDestination(destination);
    }

    @GetMapping("/getAll")
    public List<DestinationEntity> getAllDestinations() {
        return destinationService.getAllDestinations();
    }

    @GetMapping("/{destinationId}")
    public DestinationEntity getDestinationById(@PathVariable Long destinationId) {
        return destinationService.getDestinationById(destinationId).orElse(null);
    }

    @PutMapping("/update/{destinationId}")
    public DestinationEntity updateDestination(@PathVariable Long destinationId, @RequestBody DestinationEntity updatedDestination) {
        return destinationService.updateDestination(destinationId, updatedDestination);
    }

    @DeleteMapping("/delete/{destinationId}")
    public String deleteDestination(@PathVariable Long destinationId) {
        boolean deleted = destinationService.deleteDestination(destinationId);
        if (deleted) {
            return "Destination deleted successfully.";
        }
        return "Destination not found.";
    }
}
