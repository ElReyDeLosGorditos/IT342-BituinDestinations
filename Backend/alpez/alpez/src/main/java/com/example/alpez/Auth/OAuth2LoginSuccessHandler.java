package com.example.alpez.Auth;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import com.example.alpez.Entity.Role;
import com.example.alpez.Entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.alpez.Repo.UserRepo;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);

    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserRepo userRepo) {
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        try {
            logger.info("OAuth2 authentication success, processing user info");
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            UserEntity user;

            // Log the attributes for debugging
            logger.info("OAuth2 User Attributes: {}", attributes);

            // Extract user information from OAuth2 attributes
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            if (email == null) {
                logger.error("Email not found in OAuth2 user attributes");
                response.sendRedirect("http://localhost:5173/login?error=missing_email");
                return;
            }

            // If name is not available, use given_name or fallback to email
            if (name == null) {
                name = (String) attributes.get("given_name");
                if (name == null) {
                    name = email.split("@")[0]; // Use part of email as name if no name is provided
                }
            }

            logger.info("Processing user with email: {}, name: {}", email, name);

            // Find or create user
            Optional<UserEntity> existingUser = userRepo.findByEmail(email);
            if (existingUser.isPresent()) {
                user = existingUser.get();
                logger.info("Found existing user with ID: {}", user.getUserId());
            } else {
                user = new UserEntity();
                user.setEmail(email);
                user.setName(name);
                user.setRole(Role.USER);  // Ensure role is set for new users
                userRepo.save(user);
                logger.info("Created new user with email: {}", email);
            }

            // If role is null (i.e., user was fetched from the database), assign a default role
            if (user.getRole() == null) {
                user.setRole(Role.USER);  // Set a default role if not already set
            }

            // Generate JWT token for this user
            String jwtToken = jwtUtil.generateToken(user);
            int userid = user.getUserId();

            logger.info("Generated JWT token for user ID: {}", userid);

            // Clear any existing authentication to prevent redirect loops
            SecurityContextHolder.clearContext();

            // Redirect to frontend with token as a query parameter
            String redirectUrl = "http://localhost:5173/auth/callback?token=" + jwtToken + "&userId=" + userid + "&name=" + java.net.URLEncoder.encode(name, "UTF-8");
            logger.info("Redirecting to: {}", redirectUrl);

            // Use a cleaner redirect approach
            clearAuthenticationAttributes(request);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            // Log the error and redirect to error page
            logger.error("OAuth2 authentication error", e);
            response.sendRedirect("http://localhost:5173/login?error=authentication_failed");
        }
    }

}
