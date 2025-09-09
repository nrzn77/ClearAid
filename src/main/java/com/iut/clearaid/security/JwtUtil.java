package com.iut.clearaid.security;

import com.iut.clearaid.model.User;
import com.iut.clearaid.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtil {
    private final UserRepository userRepository;
    @Value("${spring.security.jwt.secret}")
    private String jwtSecret;
    @Value("${spring.security.jwt.expiration}")
    private int jwtExpirationMs;
    private SecretKey key;
    // Initializes the key after the class is instantiated and the jwtSecret is injected,
    // preventing the repeated creation of the key and enhancing performance
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    // Generate JWT token
    public String generateToken(String username, Long userId) {
        // Get user role from repository
        User user = userRepository.findById(userId).orElse(null);
        String role = (user != null) ? user.getRole().toString() : null;
        
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("role", role) // Add role to token
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    // Get username from JWT token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    // Get userId from JWT token
    public Long getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .get("userId", Long.class);
    }
    
    // Check if the user has ADMIN role
    public boolean isAdmin(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key).build()
                    .parseClaimsJws(token)
                    .getBody();
            
            // Get role from token claims
            String role = claims.get("role", String.class);
            
            // Check if role is ADMIN
            return "ADMIN".equals(role);
        } catch (Exception e) {
            log.error("Error checking admin role: " + e.getMessage(), e);
            return false;
        }
    }
    // Validate JWT token
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException | ExpiredJwtException | 
                 UnsupportedJwtException | IllegalArgumentException e) {
            // Using a more efficient exception handling approach
            String errorMessage = "JWT validation error: ";
            if (e instanceof SecurityException) {
                errorMessage = "Invalid JWT signature: ";
            } else if (e instanceof MalformedJwtException) {
                errorMessage = "Invalid JWT token: ";
            } else if (e instanceof ExpiredJwtException) {
                errorMessage = "JWT token is expired: ";
            } else if (e instanceof UnsupportedJwtException) {
                errorMessage = "JWT token is unsupported: ";
            } else if (e instanceof IllegalArgumentException) {
                errorMessage = "JWT claims string is empty: ";
            }
            // Using proper logging framework
            log.error(errorMessage + e.getMessage(), e);
            return false;
        }
    }
}