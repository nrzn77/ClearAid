package com.iut.clearaid.security;

import com.iut.clearaid.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class WebSecurityConfig {
    @Autowired
    CustomUserDetailsService userDetailsService;
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Updated configuration for Spring Security 6.x
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF
                .cors(cors -> cors.disable()) // Disable CORS (or configure if needed)
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(unauthorizedHandler)
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/test/all",
                                        "/swagger-ui.html",
                                        "/swagger-ui-testing.html",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/redoc.html",
                                        "/ws/**",
                                        "/api/chat/**",
                                        "/api/aws/download/**",
                                        "/api/aws/upload",
                                        "/api/utils/getAppVersionByOS/**",
                                        "/api/notifications/sendSingleNotification",
                                        "/actuator/**",
                                        "/api/deepLink/**",
                                        "/api/user/ping/**").permitAll() // Use 'requestMatchers' instead of 'antMatchers'
                                .anyRequest().authenticated()
                );
        // Add the JWT Token filter before the UsernamePasswordAuthenticationFilter
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}