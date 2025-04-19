package com.example.alpez.Entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class DestinationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String DestinationName;
    private String destinationDescription;
    private String destinationType;
    private String region;

    @OneToMany(mappedBy = "destination")
    private List<TourPackageEntity> tourPackages;
}
