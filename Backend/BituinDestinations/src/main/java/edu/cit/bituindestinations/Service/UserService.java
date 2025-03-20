package edu.cit.bituindestinations.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.bituindestinations.Entity.UserEntity;
import edu.cit.bituindestinations.Repository.UserRepository;


@Service
public class UserService {
    
    @Autowired
    private UserRepository UserRepository;
    
    public UserService(){

        super();

    }
 
    public UserEntity saveUser(UserEntity user) {
        return UserRepository.save(user);
   
    }
}
