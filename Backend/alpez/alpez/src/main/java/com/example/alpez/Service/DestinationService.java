package com.example.alpez.Service;

import com.example.alpez.Entity.DestinationEntity;
import com.example.alpez.Repo.DestinationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepo destinationRepository;

    // Create
    public DestinationEntity createDestination(DestinationEntity destination) {
        return destinationRepository.save(destination);
    }

    // Read all
    public List<DestinationEntity> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // Read by ID
    public Optional<DestinationEntity> getDestinationById(Long id) {
        return destinationRepository.findById(id);
    }

    // Update
    public DestinationEntity updateDestination(Long id, DestinationEntity updated) {
        return destinationRepository.findById(id).map(existing -> {
            existing.setDestinationName(updated.getDestinationName());
            existing.setDestinationDescription(updated.getDestinationDescription());
            existing.setDestinationType(updated.getDestinationType());
            existing.setRegion(updated.getRegion());
            return destinationRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    public boolean deleteDestination(Long id) {
        if (destinationRepository.existsById(id)) {
            destinationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
