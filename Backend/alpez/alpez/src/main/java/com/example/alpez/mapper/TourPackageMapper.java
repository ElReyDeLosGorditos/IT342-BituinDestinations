package com.example.alpez.mapper;

import com.example.alpez.DTO.TourPackageDTO;
import com.example.alpez.Entity.TourPackage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourPackageMapper {

    /**
     * Convert TourPackage entity to TourPackageDTO
     * @param tourPackage The TourPackage entity to convert
     * @return The converted TourPackageDTO
     */
    public TourPackageDTO toDTO(TourPackage tourPackage) {
        if (tourPackage == null) {
            return null;
        }

        TourPackageDTO dto = new TourPackageDTO();
        dto.setId(tourPackage.getId());
        dto.setTitle(tourPackage.getTitle());
        dto.setDescription(tourPackage.getDescription());
        dto.setAgenda(tourPackage.getAgenda());
        dto.setPrice(tourPackage.getPrice());
        dto.setDuration(tourPackage.getDuration());
        dto.setAvailableSlots(tourPackage.getAvailableSlots());
        dto.setStartDate(tourPackage.getStartDate());
        dto.setEndDate(tourPackage.getEndDate());
        
        if (tourPackage.getDestination() != null) {
            dto.setDestinationId(tourPackage.getDestination().getId());
            dto.setDestinationName(tourPackage.getDestination().getDestinationName());
        }
        
        return dto;
    }

    /**
     * Convert TourPackageDTO to TourPackage entity
     * @param dto The TourPackageDTO to convert
     * @return The converted TourPackage entity
     */
    public TourPackage toEntity(TourPackageDTO dto) {
        if (dto == null) {
            return null;
        }

        TourPackage tourPackage = new TourPackage();
        tourPackage.setId(dto.getId());
        tourPackage.setTitle(dto.getTitle());
        tourPackage.setDescription(dto.getDescription());
        tourPackage.setAgenda(dto.getAgenda());
        tourPackage.setPrice(dto.getPrice());
        tourPackage.setDuration(dto.getDuration());
        tourPackage.setAvailableSlots(dto.getAvailableSlots());
        tourPackage.setStartDate(dto.getStartDate());
        tourPackage.setEndDate(dto.getEndDate());
        
        return tourPackage;
    }

    /**
     * Convert a list of TourPackage entities to a list of TourPackageDTOs
     * @param tourPackages The list of TourPackage entities to convert
     * @return The converted list of TourPackageDTOs
     */
    public List<TourPackageDTO> toDTOList(List<TourPackage> tourPackages) {
        if (tourPackages == null) {
            return null;
        }

        return tourPackages.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a list of TourPackageDTOs to a list of TourPackage entities
     * @param dtos The list of TourPackageDTOs to convert
     * @return The converted list of TourPackage entities
     */
    public List<TourPackage> toEntityList(List<TourPackageDTO> dtos) {
        if (dtos == null) {
            return null;
        }

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
} 