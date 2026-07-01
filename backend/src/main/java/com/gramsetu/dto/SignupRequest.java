package com.gramsetu.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String fullName;

    @Email
    private String email;

    private String phoneNumber;
    private String address;
    private String ward;
    private String role; // VILLAGER or ADMIN
    private String secretKey; // For Admin registration
    private String villageId;
    private String villageName;
}
