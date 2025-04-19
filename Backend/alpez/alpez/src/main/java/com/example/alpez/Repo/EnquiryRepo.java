package com.example.alpez.Repo;

import com.example.alpez.Entity.EnquiryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnquiryRepo extends JpaRepository<EnquiryEntity, Long> {
    List<EnquiryEntity> findByUser_UserId(int userId); // Using 'userId' from your UserEntity
    List<EnquiryEntity> findByTourPackage_Id(Long tourPackageId);
    List<EnquiryEntity> findBySubmittedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}