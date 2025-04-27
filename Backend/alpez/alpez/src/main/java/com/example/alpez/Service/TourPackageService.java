package com.example.alpez.Service;

import com.example.alpez.DTO.TourPackageDTO;
import com.example.alpez.Entity.Destination;
import com.example.alpez.Entity.TourPackage;
import com.example.alpez.Repo.DestinationRepo;
import com.example.alpez.Repo.TourPackageRepo;
import com.example.alpez.mapper.TourPackageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourPackageService {

    @Autowired
    private TourPackageRepo tourPackageRepo;

    @Autowired
    private DestinationRepo destinationRepo;

    @Autowired
    private TourPackageMapper tourPackageMapper;

    public TourPackageDTO saveTourPackage(TourPackageDTO tourPackageDTO) {
        TourPackage tourPackage = tourPackageMapper.toEntity(tourPackageDTO);
        
        // Set the destination
        Optional<Destination> destinationOpt = destinationRepo.findById(tourPackageDTO.getDestinationId());
        if (destinationOpt.isPresent()) {
            tourPackage.setDestination(destinationOpt.get());
        } else {
            throw new RuntimeException("Destination not found");
        }

        TourPackage savedTourPackage = tourPackageRepo.save(tourPackage);
        return tourPackageMapper.toDTO(savedTourPackage);
    }

    public List<TourPackageDTO> getAllTourPackages() {
        List<TourPackage> tourPackages = tourPackageRepo.findAll();
        return tourPackageMapper.toDTOList(tourPackages);
    }

    public Optional<TourPackageDTO> getTourPackageById(Integer id) {
        Optional<TourPackage> tourPackage = tourPackageRepo.findById(id);
        return tourPackage.map(tourPackageMapper::toDTO);
    }

    public List<TourPackageDTO> getTourPackagesByDestinationId(Integer destinationId) {
        List<TourPackage> tourPackages = tourPackageRepo.findByDestinationId(destinationId);
        return tourPackageMapper.toDTOList(tourPackages);
    }

    public TourPackageDTO updateTourPackage(Integer id, TourPackageDTO tourPackageDTO) {
        if (tourPackageRepo.existsById(id)) {
            TourPackage tourPackage = tourPackageMapper.toEntity(tourPackageDTO);
            tourPackage.setId(id);
            
            // Set the destination
            Optional<Destination> destinationOpt = destinationRepo.findById(tourPackageDTO.getDestinationId());
            if (destinationOpt.isPresent()) {
                tourPackage.setDestination(destinationOpt.get());
            } else {
                throw new RuntimeException("Destination not found");
            }

            TourPackage updatedTourPackage = tourPackageRepo.save(tourPackage);
            return tourPackageMapper.toDTO(updatedTourPackage);
        }
        return null;
    }

    public boolean deleteTourPackage(Integer id) {
        if (tourPackageRepo.existsById(id)) {
            tourPackageRepo.deleteById(id);
            return true;
        }
        return false;
    }
} 