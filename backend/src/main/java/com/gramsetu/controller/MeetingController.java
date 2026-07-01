package com.gramsetu.controller;

import com.gramsetu.model.Meeting;
import com.gramsetu.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;

    @GetMapping("/upcoming")
    public List<Meeting> getUpcomingMeetings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return meetingService.getUpcomingMeetings(userDetails.getVillageId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Meeting scheduleMeeting(@RequestBody Meeting meeting, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return meetingService.scheduleMeeting(meeting, userDetails.getVillageId());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Meeting updateStatus(@PathVariable Long id, @RequestParam Meeting.MeetingStatus status) {
        return meetingService.updateMeetingStatus(id, status);
    }

    @GetMapping
    public List<Meeting> getAllMeetings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return meetingService.getAllMeetings(userDetails.getVillageId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMeeting(@PathVariable Long id) {
        try {
            meetingService.deleteMeeting(id);
            return ResponseEntity.ok("Meeting deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
