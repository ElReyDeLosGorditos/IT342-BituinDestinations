//package com.example.alpez.Auth;
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import com.example.alpez.Entity.UserEntity;
//import com.example.alpez.Repo.UserRepo;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
///*
//@Component
//public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
//
//    private final JwtUtil jwtUtil;
//    private final UserRepo userRepo;
//
//    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserRepo userRepo) {
//        this.jwtUtil = jwtUtil;
//        this.userRepo = userRepo;
//    }
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
//            throws IOException, ServletException {
//
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//        System.out.println("OAuth2 User Attributes: " + oAuth2User.getAttributes());
//        String email = oAuth2User.getAttribute("email");
//        String name = oAuth2User.getAttribute("given_name");
//        System.out.println(name);
//
//        Optional<UserEntity> existingUser = userRepo.findByEmail(email);
//        UserEntity user;
//if (existingUser.isPresent()) {
//    user = existingUser.get();
//} else {
//    user = new UserEntity();
//    user.setEmail(email);
//    user.setName(name);
//    userRepo.save(user);
//}
//
//        // Generate JWT token for this user
//        String jwtToken = jwtUtil.generateToken(user);
//        int userid = user.getUserId();
//        Map<String, Object> jsonResponse = new HashMap<>();
//        jsonResponse.put("token", jwtToken);
//        jsonResponse.put("id", userid);
//        jsonResponse.put("name", name);
//        response.setHeader("Authorization", "Bearer " + jwtToken);
//        System.out.println(jwtToken);
//        System.out.println(jsonResponse);
//        response.sendRedirect("/user/print");
//    }
//}
//*/
