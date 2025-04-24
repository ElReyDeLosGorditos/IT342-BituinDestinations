package com.example.alpez.Repo;

import java.util.Optional;

import com.example.alpez.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {

    
    Optional<UserEntity> findByEmail(String email); // ✅ Returns Optional for safe checking
    UserEntity getByEmail(String email); // ✅ Returns UserEntity directly
    boolean existsByEmail(String email); 

}