package com.example.alpez.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Repo.TourPackageRepo;




@Service
public class TourPackageService {
    @Autowired
    private TourPackageRepo packageRepo;
    
    

   //CREATE
    public TourPackageEntity saveTourPackage(TourPackageEntity tourpackage) {
        return packageRepo.save(tourpackage);
    }


    //READ
    public List<TourPackageEntity> getAllTourPackage(){
        return packageRepo.findAll();
    }
    public Optional<TourPackageEntity> getTourPackageByTourPackageId(int packageId) {
        return packageRepo.findById(packageId);
    }


    //UPDATE
    public TourPackageEntity updateTourPackage(int packageId, TourPackageEntity updateTourpackage) {
        TourPackageEntity tourpackage = packageRepo.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Reservation " + packageId + " not found!"));
        

                tourpackage.setName(updateTourpackage.getName());
                tourpackage.setLocation(updateTourpackage.getLocation());
                tourpackage.setDuration(updateTourpackage.getDuration());
                tourpackage.setPrice(updateTourpackage.getPrice());

        return packageRepo.save(tourpackage);
    }

    //DELETE
    public String deleteTourPackage(int packageId) {
        Optional<TourPackageEntity> tour = packageRepo.findById(packageId);
        if (tour.isPresent()) {
            packageRepo.deleteById(packageId);
            return "Tour Package has been successfully deleted!";
        } else {
            return "Tour Package with ID " + packageId + " not found!";
        }
    }
    

    
    
}