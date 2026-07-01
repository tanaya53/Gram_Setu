package com.gramsetu.controller;

import com.gramsetu.model.Complaint;
import com.gramsetu.service.ComplaintService;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public List<Complaint> getAllComplaints(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return complaintService.getAllComplaints(userDetails.getVillageId());
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('VILLAGER') or hasRole('ADMIN')")
    public Complaint createComplaint(@RequestBody Complaint complaint, 
                                     @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return complaintService.createComplaint(complaint, userDetails.getId());
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("hasRole('VILLAGER')")
    public ResponseEntity<?> vote(@PathVariable Long id, 
                                  @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            complaintService.vote(id, userDetails.getId());
            return ResponseEntity.ok("Voted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Complaint updateStatus(@PathVariable Long id, 
                                  @RequestParam Complaint.Status status,
                                  @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return complaintService.updateStatus(id, status, userDetails.getId());
    }

    @PutMapping("/{id}/priority")
    @PreAuthorize("hasRole('ADMIN')")
    public Complaint updatePriority(@PathVariable Long id, @RequestParam Complaint.Priority priority) {
        return complaintService.updatePriorityManually(id, priority);
    }

    @GetMapping("/my")
    public List<Complaint> getMyComplaints(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return complaintService.getComplaintsByUser(userDetails.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        try {
            complaintService.deleteComplaint(id);
            return ResponseEntity.ok("Complaint deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
