package com.iut.clearaid.controller;

import com.iut.clearaid.repository.UserRepository;
import com.iut.clearaid.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    public String userAccess(@RequestHeader("Authorization") String token) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        log.info("User {} (ID: {}) accessed protected endpoint", username, userId);
        return username + " has access to " + userId;
    }
}