package com.gramsetu.repository;

import com.gramsetu.model.RationDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RationDistributionRepository extends JpaRepository<RationDistribution, Long> {
    List<RationDistribution> findByRecipientId(Long userId);
    List<RationDistribution> findByRecipient_VillageId(String villageId);
}
