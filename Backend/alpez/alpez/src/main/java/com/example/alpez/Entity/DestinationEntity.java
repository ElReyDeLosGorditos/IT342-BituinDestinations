package com.example.alpez.Entity;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "destination")
public class DestinationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id")
    private Long destinationId;

    @Column(name = "destination_name")
    private String destinationName;

    @Column(name = "destination_description")
    private String destinationDescription;

    @Column(name = "destination_type")
    private String destinationType;

    @Column(name = "region")
    private String region;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    private List<TourPackageEntity> tourPackages;

    public DestinationEntity() {}

    public DestinationEntity(Long destinationId, String destinationName, String destinationDescription, String destinationType, String region) {
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.destinationDescription = destinationDescription;
        this.destinationType = destinationType;
        this.region = region;
    }

    // Getters and setters

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
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

    public List<TourPackageEntity> getTourPackages() {
        return tourPackages;
    }

    public void setTourPackages(List<TourPackageEntity> tourPackages) {
        this.tourPackages = tourPackages;
    }
}