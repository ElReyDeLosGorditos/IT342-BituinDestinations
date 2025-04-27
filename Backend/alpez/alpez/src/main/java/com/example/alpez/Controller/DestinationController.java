// DestinationController.java
package com.example.alpez.Controller;

import com.example.alpez.DTO.DestinationDTO;
import com.example.alpez.Service.DestinationService;
import com.example.alpez.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/destination")
@CrossOrigin(origins = "http://localhost:5173")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/save", consumes = "multipart/form-data")
    public ResponseEntity<DestinationDTO> saveDestination(
            @RequestParam("destinationName") String destinationName,
            @RequestParam("destinationDescription") String destinationDescription,
            @RequestParam("destinationType") String destinationType,
            @RequestParam("region") String region,
            @RequestParam("destinationLocation") String destinationLocation,
            @RequestParam("destinationImage") MultipartFile destinationImage) {
        try {
            DestinationDTO destinationDTO = new DestinationDTO();
            destinationDTO.setDestinationName(destinationName);
            destinationDTO.setDestinationDescription(destinationDescription);
            destinationDTO.setDestinationType(destinationType);
            destinationDTO.setRegion(region);
            destinationDTO.setDestinationLocation(destinationLocation);

            if (destinationImage != null && !destinationImage.isEmpty()) {
                String fileName = fileStorageService.storeFile(destinationImage);
                destinationDTO.setDestinationImage(fileName);
            }

            DestinationDTO savedDestination = destinationService.saveDestination(destinationDTO);
            return new ResponseEntity<>(savedDestination, HttpStatus.CREATED); // Use HttpStatus.CREATED for successful resource creation
        } catch (Exception e) {
            throw new RuntimeException("Error saving destination: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<DestinationDTO> updateDestination(
            @PathVariable Integer id,
            @RequestParam("destinationName") String destinationName,
            @RequestParam("destinationDescription") String destinationDescription,
            @RequestParam("destinationType") String destinationType,
            @RequestParam("region") String region,
            @RequestParam("destinationLocation") String destinationLocation,
            @RequestParam(value = "destinationImage", required = false) MultipartFile destinationImage) {
        try {
            // Get existing destination
            Optional<DestinationDTO> existingDestination = destinationService.getDestinationById(id);
            if (!existingDestination.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Create new DTO with updated values
            DestinationDTO destinationDTO = new DestinationDTO();
            destinationDTO.setId(id);
            destinationDTO.setDestinationName(destinationName);
            destinationDTO.setDestinationDescription(destinationDescription);
            destinationDTO.setDestinationType(destinationType);
            destinationDTO.setRegion(region);
            destinationDTO.setDestinationLocation(destinationLocation);

            // Handle image update
            if (destinationImage != null && !destinationImage.isEmpty()) {
                String fileName = fileStorageService.storeFile(destinationImage);
                destinationDTO.setDestinationImage(fileName);
            } else {
                // Keep existing image
                destinationDTO.setDestinationImage(existingDestination.get().getDestinationImage());
            }

            DestinationDTO updatedDestination = destinationService.updateDestination(id, destinationDTO);
            return new ResponseEntity<>(updatedDestination, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error updating destination: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        try {
            List<DestinationDTO> destinations = destinationService.getAllDestinations();
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving destinations: " + e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Integer id) {
        try {
            Optional<DestinationDTO> destinationOpt = destinationService.getDestinationById(id);
            if (destinationOpt.isPresent()) {
                return new ResponseEntity<>(destinationOpt.get(), HttpStatus.OK);
            } else {
                throw new RuntimeException("Destination not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving destination: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable Integer id) {
        try {
            boolean deleted = destinationService.deleteDestination(id);
            if (deleted) {
                return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Destination deleted successfully"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Destination not found"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error deleting destination: " + e.getMessage()
            ));
        }
    }
}