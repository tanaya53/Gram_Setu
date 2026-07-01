package com.gramsetu.repository;

import com.gramsetu.model.SchemeApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeApplicationRepository extends JpaRepository<SchemeApplication, Long> {
    List<SchemeApplication> findByUserId(Long userId);
    List<SchemeApplication> findByUser_VillageId(String villageId);
    void deleteBySchemeId(Long schemeId);
}
