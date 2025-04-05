package com.example.bituindestination.Repo;

import com.example.bituindestination.Entity.TourPackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourPackageRepo extends JpaRepository<TourPackageEntity, Integer> {

}
