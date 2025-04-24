package com.example.alpez.Auth;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.example.alpez.Entity.UserEntity;
import jakarta.annotation.PostConstruct;


import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import com.example.alpez.config.EnvConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private Key secretKey;
    private long expirationTime;
    
    @PostConstruct
    public void init() {
        // Get JWT secret key from environment variable or use a default if not found
        String jwtSecretKey = EnvConfig.get("JWT_SECRET_KEY");
        if (jwtSecretKey != null && !jwtSecretKey.equals("your_jwt_secret_key_here")) {
            // Use the provided secret key
            this.secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
        } else {
            // Generate a random key if not provided
            this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        }
        
        // Get JWT expiration time from environment variable or use default
        String expirationTimeStr = EnvConfig.get("JWT_EXPIRATION_MS");
        if (expirationTimeStr != null) {
            try {
                this.expirationTime = Long.parseLong(expirationTimeStr);
            } catch (NumberFormatException e) {
                // Use default expiration time (1 hour) if parsing fails
                this.expirationTime = 1000 * 60 * 60;
            }
        } else {
            // Use default expiration time (1 hour) if not provided
            this.expirationTime = 1000 * 60 * 60;
        }
    }
     

    // Generate token for UserEntity without role attribute
    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("username", user.getName());
        return createToken(claims, String.valueOf(user.getUserId()));
    }

    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        return createToken(claims, email);
    }

    // public String generateToken(AdminUserEntity admin) {
    //     Map<String, Object> claims = new HashMap<>();
    //     claims.put("email", admin.getEmail());
    //     claims.put("username", admin.getName());
    //     claims.put("role", admin.getRole()); // Specify admin role
    //     return createToken(claims, String.valueOf(admin.getadminId()));
    // }
    public String generateToken(OAuth2User oAuth2User) {
        Map<String, Object> claims = new HashMap<>();
        
        // Extract email from OAuth2User attributes
        String email = (String) oAuth2User.getAttributes().get("email");
        String name = (String) oAuth2User.getAttributes().get("name");
        
        // If name is not available, try other attributes or use email
        if (name == null) {
            name = (String) oAuth2User.getAttributes().get("given_name");
            if (name == null && email != null) {
                name = email.split("@")[0]; // Use part of email as name
            }
        }
        
        claims.put("email", email);
        claims.put("username", name);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(oAuth2User.getName())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact();
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public String extractUserId(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String extractUsername(String token) {
        return (String) extractAllClaims(token).get("name");
    }
    
    public String extractEmail(String token) {
        return (String) extractAllClaims(token).get("email");
    }
    
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String userId) {
        final String extractedUserId = extractUserId(token);
        return (extractedUserId.equals(userId) && !isTokenExpired(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }
}