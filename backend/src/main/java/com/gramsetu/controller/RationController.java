package com.gramsetu.controller;

import com.gramsetu.model.*;
import com.gramsetu.service.RationService;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ration")
public class RationController {
    @Autowired
    private RationService rationService;

    @GetMapping("/stock")
    public List<RationStock> getStock(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return rationService.getStock(userDetails.getVillageId());
    }

    @PostMapping("/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public RationStock updateStock(@RequestBody RationStock stock, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return rationService.updateStock(stock, userDetails.getVillageId());
    }

    @PostMapping("/distribute")
    @PreAuthorize("hasRole('ADMIN')")
    public RationDistribution distribute(@RequestParam Long userId, 
                                         @RequestParam String itemName, 
                                         @RequestParam Double quantity,
                                         @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return rationService.distribute(userId, itemName, quantity, userDetails.getVillageId());
    }

    @GetMapping("/my")
    public List<RationDistribution> getMyLogs(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return rationService.getMyRationLogs(userDetails.getId());
    }

    @GetMapping("/distributions")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RationDistribution> getAllDistributions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return rationService.getAllDistributions(userDetails.getVillageId());
    }
}
