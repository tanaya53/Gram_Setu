package com.gramsetu.repository;

import com.gramsetu.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByUserIdAndComplaintId(Long userId, Long complaintId);
    void deleteByComplaintId(Long complaintId);
}
