package com.example.bituindestination.Controller;

import com.example.it342bituindestination.Auth.JwtUtil;
import com.example.it342bituindestination.Entity.UserEntity;
import com.example.it342bituindestination.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/print")
    public String print(){
        return "I miss you!";
    }

    //CREATE
    @PostMapping("/save")
    public UserEntity saveUser(@RequestBody UserEntity user){
        return userService.saveUser(user);
    }

    //READ

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserEntity user) {
        String token = userService.authenticateUser(user.getEmail(), user.getPassword());
        int id = Integer.parseInt(jwtUtil.extractUserId(token));
        String name = jwtUtil.extractUsername(token);

        System.out.print("Logged in successfully with email: " + user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", id);
        response.put("name", name);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAll")
    public List<UserEntity> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/getUserById")
    public Optional<UserEntity> getUserbyUserId(int userId){
        return userService.getUserByUserId(userId);
    }

    //UPDATE
    @PutMapping("/update/{userId}")
    public UserEntity updateUser(@PathVariable int userId, @RequestBody UserEntity user){
        return userService.updateUser(userId, user);
    }

    //DELETE
    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId){
        return userService.deleteUser(userId);
    }
}
