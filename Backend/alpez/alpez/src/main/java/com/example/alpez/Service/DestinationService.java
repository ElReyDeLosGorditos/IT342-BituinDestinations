// DestinationService.java
package com.example.alpez.Service;

import com.example.alpez.DTO.DestinationDTO;
import com.example.alpez.Entity.Destination;
import com.example.alpez.Repo.DestinationRepo;
import com.example.alpez.mapper.DestinationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepo destinationRepo;

    @Autowired
    private DestinationMapper destinationMapper;

    public DestinationDTO saveDestination(DestinationDTO destinationDTO) {
        Destination destination = destinationMapper.toEntity(destinationDTO);
        Destination savedDestination = destinationRepo.save(destination);
        return destinationMapper.toDTO(savedDestination);
    }

    public List<DestinationDTO> getAllDestinations() {
        List<Destination> destinations = destinationRepo.findAll();
        return destinationMapper.toDTOList(destinations);
    }

    public Optional<DestinationDTO> getDestinationById(Integer id) {
        Optional<Destination> destination = destinationRepo.findById(id);
        return destination.map(destinationMapper::toDTO);
    }

    public DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO) {
        if (destinationRepo.existsById(id)) {
            Destination destination = destinationMapper.toEntity(destinationDTO);
            destination.setId(id);
            Destination updatedDestination = destinationRepo.save(destination);
            return destinationMapper.toDTO(updatedDestination);
        }
        return null;
    }

    public boolean deleteDestination(Integer id) {
        if (destinationRepo.existsById(id)) {
            destinationRepo.deleteById(id);
            return true;
        }
        return false;
    }
}