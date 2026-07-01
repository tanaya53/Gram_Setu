package com.gramsetu.controller;

import com.gramsetu.model.User;
import com.gramsetu.model.Role;
import com.gramsetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/villagers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getVillagers(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userRepository.findByVillageIdAndRole(userDetails.getVillageId(), Role.VILLAGER);
    }
}
