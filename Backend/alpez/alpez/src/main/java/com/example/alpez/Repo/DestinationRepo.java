package com.example.alpez.Repo;

import com.example.alpez.Entity.DestinationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepo extends JpaRepository<DestinationEntity, Long> {
    List<DestinationEntity> findByRegion(String region);
    List<DestinationEntity> findByDestinationType(String destinationType);
    List<DestinationEntity> findByDestinationNameContainingIgnoreCase(String keyword);
}
