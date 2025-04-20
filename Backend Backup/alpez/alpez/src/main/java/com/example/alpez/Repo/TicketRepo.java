package com.example.alpez.Repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alpez.Entity.TicketEntity;


@Repository
public interface TicketRepo extends JpaRepository<TicketEntity, Integer>{
 
}