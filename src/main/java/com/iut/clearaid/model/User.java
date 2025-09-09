package com.iut.clearaid.model;

import com.iut.clearaid.model.enums.Users;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String username;
    
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Users role = Users.VOLUNTEER; // Set default value in Java instead of DB
}