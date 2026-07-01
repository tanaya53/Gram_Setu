package com.gramsetu.repository;

import com.gramsetu.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByVillageIdOrderByCreatedAtDesc(String villageId);
}
