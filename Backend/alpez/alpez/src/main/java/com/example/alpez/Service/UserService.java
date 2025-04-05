package com.example.alpez.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.alpez.Auth.JwtUtil;
import com.example.alpez.Entity.UserEntity;
import com.example.alpez.Repo.UserRepo;




@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtUtil jwtUtil;
    
    

   //CREATE
    public UserEntity saveUser(UserEntity user) {
        return userRepo.save(user);
    }


    //READ
    public List<UserEntity> getAllUsers(){
        return userRepo.findAll();
    }
    public Optional<UserEntity> getUserByUserId(int userId) {
        return userRepo.findById(userId);
    }

    public String authenticateUser(String email, String password) {
        System.out.println("Authenticating user with email: " + email); 
        UserEntity user = userRepo.getByEmail(email); 
    
            if (user != null) {
                System.out.println("User found: " + user.getEmail()); 
                if (user.getPassword().equals(password)) { 
                    System.out.println("Password is correct. Generating token."); 
                    System.out.println(jwtUtil.generateToken(user)); 
                    return jwtUtil.generateToken(user); 
                } else {
                    System.out.println("Invalid credentials: password does not match."); 
                    throw new RuntimeException("Invalid credentials"); 
                }
            } else {
                System.out.println("User not found with email: " + email); 
                throw new RuntimeException("User not found"); 
            }
        }


    //UPDATE
    public UserEntity updateUser(int userId, UserEntity updateUser) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Reservation " + userId + " not found!"));
        

                user.setName(updateUser.getName());
                user.setEmail(updateUser.getEmail());
                user.setPassword(updateUser.getPassword());
        return userRepo.save(user);
    }

    //DELETE
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