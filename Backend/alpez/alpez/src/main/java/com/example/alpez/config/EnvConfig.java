package com.example.alpez.config;

import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class EnvConfig {
    
    private static Dotenv dotenv;
    
    
    /**
     * Get an environment variable value
     * @param key The environment variable key
     * @return The environment variable value or null if not found
     */
    public static String get(String key) {
        if (dotenv == null) {
            // Lazy initialization if not already loaded
            dotenv = Dotenv.configure().load();
        }
        return dotenv.get(key);
    }
    
    /**
     * Get an environment variable value with a default fallback
     * @param key The environment variable key
     * @param defaultValue The default value to return if the key is not found
     * @return The environment variable value or the default value if not found
     */
    public static String get(String key, String defaultValue) {
        if (dotenv == null) {
            // Lazy initialization if not already loaded
            dotenv = Dotenv.configure().load();
        }
        return dotenv.get(key, defaultValue);
    }
}
