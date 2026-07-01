package com.gramsetu.service;

import com.gramsetu.model.Complaint;
import com.gramsetu.model.User;
import com.gramsetu.model.Vote;
import com.gramsetu.model.Notice;
import com.gramsetu.repository.ComplaintRepository;
import com.gramsetu.repository.UserRepository;
import com.gramsetu.repository.VoteRepository;
import com.gramsetu.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Complaint> getAllComplaints(String villageId) {
        return complaintRepository.findByUser_VillageId(villageId);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    public Complaint createComplaint(Complaint complaint, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        complaint.setUser(user);
        complaint.setStatus(Complaint.Status.SUBMITTED);
        complaint.setPriority(Complaint.Priority.LOW);
        complaint.setVoteCount(0);
        return complaintRepository.save(complaint);
    }

    @Transactional
    public void vote(Long complaintId, Long userId) {
        if (voteRepository.existsByUserIdAndComplaintId(userId, complaintId)) {
            throw new RuntimeException("Already voted on this complaint");
        }

        Complaint complaint = getComplaintById(complaintId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Vote vote = Vote.builder().user(user).complaint(complaint).build();
        voteRepository.save(vote);

        complaint.setVoteCount(complaint.getVoteCount() + 1);
        updatePriority(complaint);
        complaintRepository.save(complaint);
    }

    private void updatePriority(Complaint complaint) {
        int votes = complaint.getVoteCount();
        if (votes >= 50) {
            complaint.setPriority(Complaint.Priority.HIGH);
        } else if (votes >= 10) {
            complaint.setPriority(Complaint.Priority.MEDIUM);
        }
    }

    public Complaint updateStatus(Long id, Complaint.Status status, Long adminId) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status);
        Complaint saved = complaintRepository.save(complaint);

        if (status == Complaint.Status.RESOLVED) {
            User admin = userRepository.findById(adminId).orElse(null);
            String noticeTitle = "Complaint Resolved: " + complaint.getTitle();
            String noticeContent = "The complaint regarding '" + complaint.getTitle() + 
                                   "' filed by " + (complaint.getUser() != null ? complaint.getUser().getFullName() : "a villager") + 
                                   " has been marked as RESOLVED.";
            Notice notice = Notice.builder()
                    .title(noticeTitle)
                    .content(noticeContent)
                    .type(Notice.NoticeType.GENERAL)
                    .admin(admin)
                    .villageId(complaint.getUser() != null ? complaint.getUser().getVillageId() : (admin != null ? admin.getVillageId() : null))
                    .build();
            noticeRepository.save(notice);
        }
        return saved;
    }

    public Complaint updatePriorityManually(Long id, Complaint.Priority priority) {
        Complaint complaint = getComplaintById(id);
        complaint.setPriority(priority);
        return complaintRepository.save(complaint);
    }

    @Transactional
    public void deleteComplaint(Long id) {
        voteRepository.deleteByComplaintId(id);
        complaintRepository.deleteById(id);
    }
}
