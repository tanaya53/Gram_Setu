package com.gramsetu.controller;

import com.gramsetu.model.EmergencyContact;
import com.gramsetu.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {
    @Autowired
    private EmergencyContactRepository repository;

    @GetMapping
    public List<EmergencyContact> getAll(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return repository.findByVillageId(userDetails.getVillageId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EmergencyContact add(@RequestBody EmergencyContact contact, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        contact.setVillageId(userDetails.getVillageId());
        return repository.save(contact);
    }
}
