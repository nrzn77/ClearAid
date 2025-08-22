package com.iut.clearaid.model;

import com.iut.clearaid.model.enums.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SignInObject {
    private String username;
    private String password;
    private Users role = Users.VOLUNTEER; // Default role
}
