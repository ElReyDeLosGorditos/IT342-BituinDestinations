package com.example.alpez.DTO;

import java.time.LocalDate;

public class TourPackageDTO {
    private Integer id;
    private String title;
    private String description;
    private String agenda;
    private Double price;
    private String duration;
    private Integer availableSlots;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer destinationId;
    private String destinationName;

    // Default constructor
    public TourPackageDTO() {}

    // Constructor with all fields
    public TourPackageDTO(Integer id, String title, String description, String agenda,
                         Double price, String duration, Integer availableSlots,
                         LocalDate startDate, LocalDate endDate, Integer destinationId,
                         String destinationName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.agenda = agenda;
        this.price = price;
        this.duration = duration;
        this.availableSlots = availableSlots;
        this.startDate = startDate;
        this.endDate = endDate;
        this.destinationId = destinationId;
        this.destinationName = destinationName;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAgenda() {
        return agenda;
    }

    public void setAgenda(String agenda) {
        this.agenda = agenda;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(Integer availableSlots) {
        this.availableSlots = availableSlots;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Integer destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    @Override
    public String toString() {
        return "TourPackageDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", agenda='" + agenda + '\'' +
                ", price=" + price +
                ", duration='" + duration + '\'' +
                ", availableSlots=" + availableSlots +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", destinationId=" + destinationId +
                ", destinationName='" + destinationName + '\'' +
                '}';
    }
} 