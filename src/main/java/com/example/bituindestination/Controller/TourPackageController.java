package com.example.bituindestination.Controller;

import com.example.bituindestination.Entity.TourPackageEntity;
import com.example.bituindestination.Service.TourPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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