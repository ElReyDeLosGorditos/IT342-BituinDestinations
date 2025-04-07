package com.example.alpez.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.alpez.Entity.TourPackageEntity;
import com.example.alpez.Repo.TourPackageRepo;




//@Service
//public class TourPackageService {
//    @Autowired
//    private TourPackageRepo packageRepo;
//
//
//
//   //CREATE
//    public TourPackageEntity saveTourPackage(TourPackageEntity tourpackage) {
//        return packageRepo.save(tourpackage);
//    }
//
//
//    //READ
//    public List<TourPackageEntity> getAllTourPackage(){
//        return packageRepo.findAll();
//    }
//    public Optional<TourPackageEntity> getTourPackageByTourPackageId(int packageId) {
//        return packageRepo.findById(packageId);
//    }
//
//
//    //UPDATE
//    public TourPackageEntity updateTourPackage(int packageId, TourPackageEntity updateTourpackage) {
//        TourPackageEntity tourpackage = packageRepo.findById(packageId)
//                .orElseThrow(() -> new RuntimeException("Tour Package " + packageId + " not found!"));
//
//
//                tourpackage.setName(updateTourpackage.getName());
//                tourpackage.setLocation(updateTourpackage.getLocation());
//                tourpackage.setDuration(updateTourpackage.getDuration());
//                tourpackage.setPrice(updateTourpackage.getPrice());
//                tourpackage.setImageUrl(updateTourpackage.getImageUrl());
//
//        return packageRepo.save(tourpackage);
//    }
//
//    //DELETE
//    public String deleteTourPackage(int packageId) {
//        Optional<TourPackageEntity> tour = packageRepo.findById(packageId);
//        if (tour.isPresent()) {
//            packageRepo.deleteById(packageId);
//            return "Tour Package has been successfully deleted!";
//        } else {
//            return "Tour Package with ID " + packageId + " not found!";
//        }
//    }

@Service
public class TourPackageService {

    @Autowired
    private TourPackageRepo packageRepo;

    public TourPackageEntity saveTourPackage(TourPackageEntity tourpackage) {
        return packageRepo.save(tourpackage);
    }

    public List<TourPackageEntity> getAllTourPackage() {
        return packageRepo.findAll();
    }

    public Optional<TourPackageEntity> getTourPackageByTourPackageId(int packageId) {
        return packageRepo.findById(packageId);
    }

    public TourPackageEntity updateTourPackage(int packageId, TourPackageEntity updated) {
        TourPackageEntity tour = packageRepo.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Tour Package " + packageId + " not found!"));

        tour.setName(updated.getName());
        tour.setLocation(updated.getLocation());
        tour.setDuration(updated.getDuration());
        tour.setPrice(updated.getPrice());
        tour.setImageUrl(updated.getImageUrl());

        return packageRepo.save(tour);
    }

    public String deleteTourPackage(int packageId) {
        Optional<TourPackageEntity> tour = packageRepo.findById(packageId);
        if (tour.isPresent()) {
            packageRepo.deleteById(packageId);
            return "Tour Package deleted successfully!";
        } else {
            return "Tour Package not found!";
        }
    }

    public List<TourPackageEntity> searchTourPackages(String keyword, String sortBy, String sortDir) {
        Sort sort = Sort.unsorted();

        if (sortBy != null && !sortBy.isEmpty()) {
            sort = Sort.by(
                    (sortDir != null && sortDir.equalsIgnoreCase("desc")) ? Sort.Direction.DESC : Sort.Direction.ASC,
                    sortBy
            );
        }

        if (keyword != null && !keyword.isEmpty()) {
            return packageRepo.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(keyword, keyword, sort);
        } else {
            return packageRepo.findAll(sort);
        }
    }
}