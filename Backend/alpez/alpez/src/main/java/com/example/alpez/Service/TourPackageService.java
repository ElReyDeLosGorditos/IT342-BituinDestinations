package com.example.alpez.Service;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Repo.TourPackageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourPackageService {

    @Autowired
    private TourPackageRepo packageRepo;

    // CREATE
    public TourPackageEntity createTourPackage(TourPackageEntity tourPackage) {
        return packageRepo.save(tourPackage);
    }

    // READ all
    public List<TourPackageEntity> getAllTourPackages() {
        return packageRepo.findAll();
    }

    // READ one by ID
    public Optional<TourPackageEntity> getTourPackageById(int id) {
        return packageRepo.findById(id);
    }

    // UPDATE
    public TourPackageEntity updateTourPackage(int id, TourPackageEntity updatedPackage) {
        return packageRepo.findById(id).map(existing -> {
            existing.setTitle(updatedPackage.getTitle());
            existing.setDescription(updatedPackage.getDescription());
            existing.setPrice(updatedPackage.getPrice());
            existing.setDuration(updatedPackage.getDuration());
            existing.setAvailableSlots(updatedPackage.getAvailableSlots());
            existing.setCreatedAt(updatedPackage.getCreatedAt());
            existing.setDestination(updatedPackage.getDestination());
            return packageRepo.save(existing);
        }).orElse(null);
    }

    // DELETE
    public String deleteTourPackage(int id) {
        if (packageRepo.existsById(id)) {
            packageRepo.deleteById(id);
            return "TourPackage deleted successfully.";
        }
        return "TourPackage not found.";
    }

    
    public List<TourPackageEntity> searchTourPackages(String keyword, String sortBy, String sortDir) {
        return packageRepo.findAll(); 
    }
}
