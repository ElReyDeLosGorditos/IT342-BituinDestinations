package com.example.alpez.Repo;

import com.example.alpez.Entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourPackageRepo extends JpaRepository<TourPackage, Integer> {
    List<TourPackage> findByDestinationId(Integer destinationId);
} 