package com.example.alpez.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Service.TourPackageService;

@RestController
@CrossOrigin
@RequestMapping("/tourpackage")
public class TourPackageController {
    @Autowired
    TourPackageService tourpackageService;

    @GetMapping("/print")
    public String print(){
        return "I dont you!";
    }

    //CREATE
    @PostMapping("/save")
    public TourPackageEntity saveTourPackage(@RequestBody TourPackageEntity tour){
        return tourpackageService.saveTourPackage(tour);
    }

    //READ
    @GetMapping("/getAll")
    public List<TourPackageEntity> getAllTourPackages(){
        return tourpackageService.getAllTourPackage();
    }
   
    //UPDATE
    @PutMapping("/update/{packageId}")
    public TourPackageEntity updateTourPackage(@PathVariable int packageId, @RequestBody TourPackageEntity tour){
        return tourpackageService.updateTourPackage(packageId, tour);
    }

    //DELETE
    @DeleteMapping("/delete/{packageId}")
    public String deleteReservation(@PathVariable int packageId){
        return tourpackageService.deleteTourPackage(packageId);
    }
}