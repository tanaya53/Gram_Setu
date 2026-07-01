package com.gramsetu.controller;

import com.gramsetu.dto.*;
import com.gramsetu.model.Role;
import com.gramsetu.model.User;
import com.gramsetu.model.Village;
import com.gramsetu.repository.UserRepository;
import com.gramsetu.repository.VillageRepository;
import com.gramsetu.security.jwt.JwtUtils;
import com.gramsetu.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VillageRepository villageRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${gramsetu.admin.secret}")
    private String adminSecretKey;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        String villageName = null;
        if (userDetails.getVillageId() != null) {
            villageName = villageRepository.findById(userDetails.getVillageId())
                    .map(Village::getVillageName)
                    .orElse(null);
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                userDetails.getVillageId(),
                villageName));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (signUpRequest.getEmail() != null && !signUpRequest.getEmail().isBlank() && userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (signUpRequest.getVillageId() == null || signUpRequest.getVillageId().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Village ID is required!"));
        }

        String strRole = signUpRequest.getRole();
        String villageId = signUpRequest.getVillageId().trim();

        if (strRole != null && (strRole.equalsIgnoreCase("ADMIN") || strRole.equalsIgnoreCase("SUPER_ADMIN"))) {
            if (signUpRequest.getSecretKey() == null || !signUpRequest.getSecretKey().equals(adminSecretKey)) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Invalid Secret Key for Admin registration!"));
            }
            if (signUpRequest.getVillageName() == null || signUpRequest.getVillageName().isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Village Name is required for authority registration!"));
            }
            villageRepository.findById(villageId)
                    .orElseGet(() -> villageRepository.save(
                            Village.builder()
                                    .villageId(villageId)
                                    .villageName(signUpRequest.getVillageName().trim())
                                    .build()
                    ));
        } else {
            boolean villageExists = villageRepository.existsById(villageId);
            if (!villageExists) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: This Village ID is not registered yet. Please check with your village authority."));
            }
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail() != null && !signUpRequest.getEmail().isBlank() ? signUpRequest.getEmail().trim() : null)
                .phoneNumber(signUpRequest.getPhoneNumber())
                .address(signUpRequest.getAddress())
                .ward(signUpRequest.getWard())
                .villageId(villageId)
                .build();

        if (strRole == null) {
            user.setRole(Role.VILLAGER);
        } else {
            switch (strRole.toUpperCase()) {
                case "ADMIN":
                    user.setRole(Role.ADMIN);
                    break;
                case "SUPER_ADMIN":
                    user.setRole(Role.SUPER_ADMIN);
                    break;
                default:
                    user.setRole(Role.VILLAGER);
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
