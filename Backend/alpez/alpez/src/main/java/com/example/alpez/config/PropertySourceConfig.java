package com.example.alpez.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;

import java.io.File;

/**
 * Configuration to properly load environment variables from .env file
 * This ensures variables are available before Spring processes application.properties
 */
@Configuration
public class PropertySourceConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        
        // Try to load from .env file if it exists
        File envFile = new File(".env");
        if (envFile.exists()) {
            configurer.setLocation(new FileSystemResource(envFile));
            System.out.println("Loaded environment variables from .env file");
        } else {
            System.out.println("No .env file found, using system environment variables");
        }
        
        // Allow environment variables to override properties from file
        configurer.setLocalOverride(true);
        
        return configurer;
    }
}
