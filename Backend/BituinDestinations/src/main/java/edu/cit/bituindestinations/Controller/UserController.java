package edu.cit.bituindestinations.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.bituindestinations.Entity.UserEntity;
import edu.cit.bituindestinations.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/save")
    public UserEntity saveUser(@RequestBody UserEntity user) {
        //TODO: process POST request
        
        return userService.saveUser(user);
        
    }
     
    @GetMapping("/secured")
    public String secured() {
        return "Hello secure";  
    }

    @GetMapping("/homepage")
public String homepage() {
    return "homepage";      
}

}
