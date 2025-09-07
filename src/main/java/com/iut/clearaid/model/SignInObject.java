package com.iut.clearaid.model;

import com.iut.clearaid.model.enums.Users;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignInObject {
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 120, message = "Password must be between 6 and 120 characters")
    private String password;
    
    private Users role = Users.VOLUNTEER; // Default role
}
