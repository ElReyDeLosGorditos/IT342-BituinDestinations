package com.example.alpez.Controller;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Service.TourPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/tourpackage")
public class TourPackageController {

    @Autowired
    private TourPackageService tourPackageService;

    @PostMapping("/save")
    public TourPackageEntity saveTourPackage(@RequestBody TourPackageEntity tourPackage) {
        return tourPackageService.createTourPackage(tourPackage);
    }

    @GetMapping("/getAll")
    public List<TourPackageEntity> getAllTourPackages() {
        return tourPackageService.getAllTourPackages();
    }

    @GetMapping("/{packageId}")
    public TourPackageEntity getTourPackageById(@PathVariable int packageId) {
        return tourPackageService.getTourPackageById(packageId).orElse(null);
    }

    @PutMapping("/update/{packageId}")
    public TourPackageEntity updateTourPackage(@PathVariable int packageId, @RequestBody TourPackageEntity updatedTourPackage) {
        return tourPackageService.updateTourPackage(packageId, updatedTourPackage);
    }

    @DeleteMapping("/delete/{packageId}")
    public String deleteTourPackage(@PathVariable int packageId) {
        return tourPackageService.deleteTourPackage(packageId);
    }

    @GetMapping("/search")
    public List<TourPackageEntity> searchTourPackages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    ) {
        return tourPackageService.searchTourPackages(keyword, sortBy, sortDir);
    }
}
