package com.example.alpez.mapper;

import com.example.alpez.DTO.DestinationDTO;
import com.example.alpez.Entity.Destination;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DestinationMapper {

    /**
     * Convert Destination entity to DestinationDTO
     * @param destination The Destination entity to convert
     * @return The converted DestinationDTO
     */
    public DestinationDTO toDTO(Destination destination) {
        if (destination == null) {
            return null;
        }

        DestinationDTO dto = new DestinationDTO();
        dto.setId(destination.getId());
        dto.setDestinationName(destination.getDestinationName());
        dto.setDestinationDescription(destination.getDestinationDescription());
        dto.setDestinationType(destination.getDestinationType());
        dto.setRegion(destination.getRegion());
        dto.setDestinationImage(destination.getDestinationImage());
        dto.setDestinationLocation(destination.getDestinationLocation());
        
        return dto;
    }

    /**
     * Convert DestinationDTO to Destination entity
     * @param dto The DestinationDTO to convert
     * @return The converted Destination entity
     */
    public Destination toEntity(DestinationDTO dto) {
        if (dto == null) {
            return null;
        }

        Destination destination = new Destination();
        destination.setId(dto.getId());
        destination.setDestinationName(dto.getDestinationName());
        destination.setDestinationDescription(dto.getDestinationDescription());
        destination.setDestinationType(dto.getDestinationType());
        destination.setRegion(dto.getRegion());
        destination.setDestinationImage(dto.getDestinationImage());
        destination.setDestinationLocation(dto.getDestinationLocation());
        
        return destination;
    }

    /**
     * Convert a list of Destination entities to a list of DestinationDTOs
     * @param destinations The list of Destination entities to convert
     * @return The converted list of DestinationDTOs
     */
    public List<DestinationDTO> toDTOList(List<Destination> destinations) {
        if (destinations == null) {
            return null;
        }

        return destinations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a list of DestinationDTOs to a list of Destination entities
     * @param dtos The list of DestinationDTOs to convert
     * @return The converted list of Destination entities
     */
    public List<Destination> toEntityList(List<DestinationDTO> dtos) {
        if (dtos == null) {
            return null;
        }

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
} 