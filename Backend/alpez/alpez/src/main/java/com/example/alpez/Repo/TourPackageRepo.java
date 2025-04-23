package com.example.alpez.Repo;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alpez.Entity.TourPackageEntity;

import java.util.List;


@Repository
public interface TourPackageRepo extends JpaRepository<TourPackageEntity, Integer> {
    // Assuming 'location' is part of the associated 'DestinationEntity'
    List<TourPackageEntity> findByTitleContainingIgnoreCaseOrDestination_DestinationNameContainingIgnoreCase(String title, String destinationName, Sort sort);
}