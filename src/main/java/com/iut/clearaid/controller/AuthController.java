package com.iut.clearaid.controller;

import com.iut.clearaid.model.SignInObject;
import com.iut.clearaid.model.User;
import com.iut.clearaid.repository.UserRepository;
import com.iut.clearaid.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<String> authenticateUser(@Valid @RequestBody SignInObject user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        try {
            log.info("Attempting authentication for user: {}", user.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            user.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(
                    userDetails.getUsername(),
                    userRepository.findIdByUsername(userDetails.getUsername())
            );
            log.info("User authenticated successfully: {}", user.getUsername());
            return ResponseEntity.ok("{\"token\":\"" + token + "\"}");
        } catch (BadCredentialsException e) {
            log.warn("Authentication failed for user: {}", user.getUsername());
            return ResponseEntity.status(401).body("{\"error\":\"Invalid username or password\"}");
        } catch (Exception e) {
            log.error("Authentication error for user: {}", user.getUsername(), e);
            return ResponseEntity.status(500).body("{\"error\":\"Authentication error: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@Valid @RequestBody SignInObject user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            
            // Create new user's account
            User newUser = new User(
                    null,
                    user.getUsername(),
                    encoder.encode(user.getPassword()),
                    user.getRole()
            );
            userRepository.save(newUser);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            log.error("Registration error", e);
            return ResponseEntity.status(500).body("Registration error: " + e.getMessage());
        }
    }
    
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameAvailability(@PathVariable String username) {
        try {
            boolean exists = userRepository.existsByUsername(username);
            return ResponseEntity.ok(!exists);
        } catch (Exception e) {
            log.error("Error checking username availability", e);
            return ResponseEntity.status(500).body(false);
        }
    }
}