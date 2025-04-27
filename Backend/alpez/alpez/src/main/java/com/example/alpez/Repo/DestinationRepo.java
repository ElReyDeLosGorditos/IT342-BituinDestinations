package com.example.alpez.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alpez.Entity.Destination;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Integer> {
    boolean existsByDestinationName(String destinationName);
}