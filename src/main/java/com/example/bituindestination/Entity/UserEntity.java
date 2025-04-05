package com.example.bituindestination.Entity;

import jakarta.persistence.*;

import java.util.Optional;

@Entity
@Table(name = "User")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = true)
    private String password;


    public UserEntity() {
        super();
    }

    public UserEntity(int userId, String name, String email, String password ) {
        super();
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public static boolean isEmpty(Optional<UserEntity> user) {
        return !user.isPresent(); // ✅ Inverts `isPresent()`
    }
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
