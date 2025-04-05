package com.example.bituindestination.Repo;

import com.example.bituindestination.Entity.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepo extends JpaRepository<TicketEntity, Integer>{

}
