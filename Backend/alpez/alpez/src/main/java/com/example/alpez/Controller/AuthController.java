package com.example.alpez.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("/error")
    public ResponseEntity<Map<String, String>> handleAuthError(
            @RequestParam(value = "error", required = false) String error) {
        
        logger.error("Authentication error: {}", error);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Authentication failed");
        if (error != null && !error.isEmpty()) {
            response.put("error", error);
        }
        
        return ResponseEntity.status(401).body(response);
    }
}
