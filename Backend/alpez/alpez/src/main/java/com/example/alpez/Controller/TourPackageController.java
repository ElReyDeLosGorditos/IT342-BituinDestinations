package com.example.alpez.Controller;

import com.example.alpez.DTO.TourPackageDTO;
import com.example.alpez.Service.TourPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tour-packages")
@CrossOrigin(origins = "https://it-342-bituin-destinations.vercel.app")
public class TourPackageController {

    @Autowired
    private TourPackageService tourPackageService;

    @PostMapping("/save")
    public ResponseEntity<TourPackageDTO> saveTourPackage(@RequestBody TourPackageDTO tourPackageDTO) {
        try {
            TourPackageDTO savedTourPackage = tourPackageService.saveTourPackage(tourPackageDTO);
            return new ResponseEntity<>(savedTourPackage, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating tour package: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<TourPackageDTO>> getAllTourPackages() {
        try {
            List<TourPackageDTO> tourPackages = tourPackageService.getAllTourPackages();
            return new ResponseEntity<>(tourPackages, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tour packages: " + e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<TourPackageDTO> getTourPackageById(@PathVariable Integer id) {
        try {
            Optional<TourPackageDTO> tourPackageOpt = tourPackageService.getTourPackageById(id);
            if (tourPackageOpt.isPresent()) {
                return new ResponseEntity<>(tourPackageOpt.get(), HttpStatus.OK);
            } else {
                throw new RuntimeException("Tour package not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tour package: " + e.getMessage());
        }
    }

    @GetMapping("/getByDestination/{destinationId}")
    public ResponseEntity<List<TourPackageDTO>> getTourPackagesByDestinationId(@PathVariable Integer destinationId) {
        try {
            List<TourPackageDTO> tourPackages = tourPackageService.getTourPackagesByDestinationId(destinationId);
            return new ResponseEntity<>(tourPackages, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tour packages: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TourPackageDTO> updateTourPackage(
            @PathVariable Integer id,
            @RequestBody TourPackageDTO tourPackageDTO) {
        try {
            TourPackageDTO updatedTourPackage = tourPackageService.updateTourPackage(id, tourPackageDTO);
            if (updatedTourPackage != null) {
                return new ResponseEntity<>(updatedTourPackage, HttpStatus.OK);
            }
            throw new RuntimeException("Tour package not found");
        } catch (Exception e) {
            throw new RuntimeException("Error updating tour package: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTourPackage(@PathVariable Integer id) {
        try {
            if (tourPackageService.deleteTourPackage(id)) {
                return new ResponseEntity<>(HttpStatus.OK);
            }
            throw new RuntimeException("Tour package not found");
        } catch (Exception e) {
            throw new RuntimeException("Error deleting tour package: " + e.getMessage());
        }
    }
} 