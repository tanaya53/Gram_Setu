package com.gramsetu.controller;

import com.gramsetu.model.Notice;
import com.gramsetu.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.gramsetu.security.services.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    @GetMapping
    public List<Notice> getAllNotices(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return noticeService.getAllNotices(userDetails.getVillageId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Notice createNotice(@RequestBody Notice notice, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return noticeService.createNotice(notice, userDetails.getVillageId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
    }
}
