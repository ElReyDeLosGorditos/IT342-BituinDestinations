package com.example.alpez.DTO;

public class DestinationDTO {
    private Integer id;
    private String destinationName;
    private String destinationDescription;
    private String destinationType;
    private String region;
    private String destinationImage;
    private String destinationLocation;

    // Default constructor
    public DestinationDTO() {}

    // Constructor with all fields
    public DestinationDTO(Integer id, String destinationName, String destinationDescription,
                         String destinationType, String region, String destinationImage,
                         String destinationLocation) {
        this.id = id;
        this.destinationName = destinationName;
        this.destinationDescription = destinationDescription;
        this.destinationType = destinationType;
        this.region = region;
        this.destinationImage = destinationImage;
        this.destinationLocation = destinationLocation;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getDestinationDescription() {
        return destinationDescription;
    }

    public void setDestinationDescription(String destinationDescription) {
        this.destinationDescription = destinationDescription;
    }

    public String getDestinationType() {
        return destinationType;
    }

    public void setDestinationType(String destinationType) {
        this.destinationType = destinationType;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getDestinationImage() {
        return destinationImage;
    }

    public void setDestinationImage(String destinationImage) {
        this.destinationImage = destinationImage;
    }

    public String getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(String destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    // toString method for debugging and logging
    @Override
    public String toString() {
        return "DestinationDTO{" +
                "id=" + id +
                ", destinationName='" + destinationName + '\'' +
                ", destinationDescription='" + destinationDescription + '\'' +
                ", destinationType='" + destinationType + '\'' +
                ", region='" + region + '\'' +
                ", destinationImage='" + destinationImage + '\'' +
                ", destinationLocation='" + destinationLocation + '\'' +
                '}';
    }
} 