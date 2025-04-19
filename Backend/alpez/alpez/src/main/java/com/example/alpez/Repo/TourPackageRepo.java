package com.example.alpez.Repo;

import com.example.alpez.Entity.TourPackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TourPackageRepo extends JpaRepository<TourPackageEntity, Long> {
    List<TourPackageEntity> findByDestination_Id(Long destinationId);
    List<TourPackageEntity> findByTitleContainingIgnoreCase(String keyword);
    List<TourPackageEntity> findByPriceLessThan(Double price);
    List<TourPackageEntity> findByPriceGreaterThan(Double price);
    List<TourPackageEntity> findByDuration(String duration);
    List<TourPackageEntity> findByAvailableSlotsGreaterThanEqual(Integer slots);
    List<TourPackageEntity> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    // @Query("SELECT tp FROM TourPackageEntity tp WHERE tp.destination.region = :region AND tp.price <= :maxPrice")
    // List<TourPackageEntity> findByRegionAndMaxPrice(@Param("region") String region, @Param("maxPrice") Double maxPrice);
}

