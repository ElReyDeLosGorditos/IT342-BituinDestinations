package com.example.alpez.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alpez.Entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {

    
    Optional<UserEntity> findByEmail(String email); // ✅ Returns Optional for safe checking
    UserEntity getByEmail(String email); // ✅ Returns UserEntity directly
    boolean existsByEmail(String email);
    List<UserEntity> findByRole(UserEntity.Role role);

}