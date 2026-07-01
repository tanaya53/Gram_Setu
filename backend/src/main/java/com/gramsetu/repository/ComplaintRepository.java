package com.gramsetu.repository;

import com.gramsetu.model.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUser_VillageId(String villageId);
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByWard(String ward);
    List<Complaint> findByStatus(Complaint.Status status);
    Page<Complaint> findAllByOrderByVoteCountDesc(Pageable pageable);
}
