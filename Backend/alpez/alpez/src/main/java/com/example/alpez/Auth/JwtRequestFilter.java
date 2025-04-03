    package com.example.alpez.Auth;

    import java.io.IOException;
    import java.util.Collections;
    import java.util.Optional;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.stereotype.Component;
    import org.springframework.web.filter.OncePerRequestFilter;

    import com.example.alpez.Entity.UserEntity;
    import com.example.alpez.Repo.UserRepo;

    import jakarta.servlet.FilterChain;
    import jakarta.servlet.ServletException;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;

    @Component
    public class JwtRequestFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;

        @Autowired
        private UserRepo userRepo;

        public JwtRequestFilter(JwtUtil jwtUtil) {
            this.jwtUtil = jwtUtil;
        }

        @SuppressWarnings("null")
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            final String authorizationHeader = request.getHeader("Authorization");
        
            String userId = null;
            String jwt = null;
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                chain.doFilter(request, response);
                return; 
            }
        
        
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7); 
                userId = jwtUtil.extractUserId(jwt); 
                System.out.println("User ID extracted from JWT: " + userId);
            }
        
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<UserEntity> userEntityOptional = userRepo.findById(Integer.valueOf(userId)); 
        
                if (userEntityOptional.isPresent() && jwtUtil.validateToken(jwt, userId)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userEntityOptional.get(), null, Collections.emptyList()); 
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("User authenticated: " + userId);
                } else {
                    System.out.println("Invalid JWT token or user not found");
                }
            } else {
                System.out.println("No JWT token found");
            }
        
            chain.doFilter(request, response); 
        }
    }
