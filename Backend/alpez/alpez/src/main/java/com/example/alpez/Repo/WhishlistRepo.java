package com.example.alpez.Repo;

import com.example.alpez.Entity.WhishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WhishlistRepo extends JpaRepository<WhishlistEntity, Long> {
    List<WhishlistEntity> findByUser_UserId(int userId); // Using 'userId' from your UserEntity
    List<WhishlistEntity> findByTourPackage_Id(Long tourPackageId);
    List<WhishlistEntity> findByAddedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
