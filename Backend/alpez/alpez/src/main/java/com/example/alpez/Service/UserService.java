package com.example.alpez.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.alpez.Entity.UserEntity;
import com.example.alpez.Repo.UserRepo;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // CREATE with error handling
    public UserEntity saveUser(UserEntity user) {
        try {
            // Check if email already exists
            if (userRepo.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            // Encrypt the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            // This catches database constraint violations
            throw new RuntimeException("Email already exists or other database constraint violated");
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }

    // READ
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<UserEntity> getUserByUserId(int userId) {
        return userRepo.findById(userId);
    }

    // Authentication with BCrypt
    public String authenticateUser(String email, String password) {
        System.out.println("Authenticating user with email: " + email);
        UserEntity user = userRepo.getByEmail(email);

        if (user != null) {
            System.out.println("User found: " + user.getEmail());
            if (passwordEncoder.matches(password, user.getPassword())) {
                System.out.println("Password is correct.");
                return "Authentication successful";
            } else {
                System.out.println("Invalid credentials: password does not match.");
                throw new RuntimeException("Invalid credentials");
            }
        } else {
            System.out.println("User not found with email: " + email);
            throw new RuntimeException("User not found");
        }
    }

    // UPDATE with error handling
    public UserEntity updateUser(int userId, UserEntity updateUser) {
        try {
            UserEntity user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User " + userId + " not found!"));

            // Check if trying to update email to one that already exists (for another user)
            if (updateUser.getEmail() != null && !updateUser.getEmail().equals(user.getEmail()) &&
                    userRepo.existsByEmail(updateUser.getEmail())) {
                throw new RuntimeException("Email already in use by another account");
            }

            if (updateUser.getName() != null) {
                user.setName(updateUser.getName());
            }

            if (updateUser.getEmail() != null) {
                user.setEmail(updateUser.getEmail());
            }

            // Only update password if a new one is provided
            if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateUser.getPassword()));
            }

            return userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Email already exists or other database constraint violated");
        } catch (RuntimeException e) {
            throw e; // Re-throw existing runtime exceptions
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    // DELETE
    public String deleteUser(int userId) {
        Optional<UserEntity> user = userRepo.findById(userId);
        if (user.isPresent()) {
            userRepo.deleteById(userId);
            return "User has been successfully deleted!";
        } else {
            return "User with ID " + userId + " not found!";
        }
    }
}