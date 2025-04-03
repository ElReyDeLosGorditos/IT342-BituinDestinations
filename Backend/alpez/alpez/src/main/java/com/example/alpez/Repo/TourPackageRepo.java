package com.example.alpez.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alpez.Entity.TourPackageEntity;

@Repository
public interface TourPackageRepo extends JpaRepository<TourPackageEntity, Integer> {

}