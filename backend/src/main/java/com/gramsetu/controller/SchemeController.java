package com.gramsetu.controller;

import com.gramsetu.model.Scheme;
import com.gramsetu.model.SchemeApplication;
import com.gramsetu.service.SchemeService;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schemes")
public class SchemeController {
    @Autowired
    private SchemeService schemeService;

    @GetMapping
    public List<Scheme> getAllSchemes(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return schemeService.getAllSchemes(userDetails.getVillageId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Scheme createScheme(@RequestBody Scheme scheme, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return schemeService.createScheme(scheme, userDetails.getVillageId());
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("hasRole('VILLAGER')")
    public SchemeApplication apply(@PathVariable Long id, 
                                   @AuthenticationPrincipal UserDetailsImpl userDetails,
                                   @RequestParam(required = false) String docsUrl) {
        return schemeService.applyForScheme(id, userDetails.getId(), docsUrl);
    }

    @GetMapping("/my-applications")
    public List<SchemeApplication> getMyApplications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return schemeService.getMyApplications(userDetails.getId());
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SchemeApplication> getAllApplications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return schemeService.getAllApplications(userDetails.getVillageId());
    }

    @PutMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public SchemeApplication updateStatus(@PathVariable Long id, @RequestParam SchemeApplication.ApplicationStatus status) {
        return schemeService.updateApplicationStatus(id, status);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Scheme updateSchemeStatus(@PathVariable Long id, @RequestParam boolean active) {
        return schemeService.updateSchemeStatus(id, active);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteScheme(@PathVariable Long id) {
        try {
            schemeService.deleteScheme(id);
            return ResponseEntity.ok("Scheme deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
