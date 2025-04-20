package com.example.alpez.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Service.TourPackageService;

//@RestController
//@CrossOrigin
//@RequestMapping("/tourpackage")
//public class TourPackageController {
//    @Autowired
//    TourPackageService tourpackageService;
//
//    @GetMapping("/print")
//    public String print(){
//        return "I dont you!";
//    }
//
//    //CREATE
//    @PostMapping("/save")
//    public TourPackageEntity saveTourPackage(@RequestBody TourPackageEntity tour){
//        return tourpackageService.saveTourPackage(tour);
//    }
//
//    //READ
//    @GetMapping("/getAll")
//    public List<TourPackageEntity> getAllTourPackages(){
//        return tourpackageService.getAllTourPackage();
//    }
//
//    //UPDATE
//    @PutMapping("/update/{packageId}")
//    public TourPackageEntity updateTourPackage(@PathVariable int packageId, @RequestBody TourPackageEntity tour){
//        return tourpackageService.updateTourPackage(packageId, tour);
//    }
//
//    //DELETE
//    @DeleteMapping("/delete/{packageId}")
//    public String deleteReservation(@PathVariable int packageId){
//        return tourpackageService.deleteTourPackage(packageId);
//    }
//}


@RestController
@CrossOrigin
@RequestMapping("/tourpackage")
public class TourPackageController {

    @Autowired
    TourPackageService tourpackageService;

    @PostMapping("/save")
    public TourPackageEntity saveTourPackage(@RequestBody TourPackageEntity tour) {
        return tourpackageService.saveTourPackage(tour);
    }

    @GetMapping("/getAll")
    public List<TourPackageEntity> getAllTourPackages() {
        return tourpackageService.getAllTourPackage();
    }

    @PutMapping("/update/{packageId}")
    public TourPackageEntity updateTourPackage(@PathVariable int packageId, @RequestBody TourPackageEntity tour) {
        return tourpackageService.updateTourPackage(packageId, tour);
    }

    @DeleteMapping("/delete/{packageId}")
    public String deleteTourPackage(@PathVariable int packageId) {
        return tourpackageService.deleteTourPackage(packageId);
    }

    @GetMapping("/search")
    public List<TourPackageEntity> searchTourPackages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    ) {
        return tourpackageService.searchTourPackages(keyword, sortBy, sortDir);
    }
}
