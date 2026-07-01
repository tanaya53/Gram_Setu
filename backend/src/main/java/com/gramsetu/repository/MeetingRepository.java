package com.gramsetu.repository;

import com.gramsetu.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByVillageIdAndDateTimeAfterOrderByDateTimeAsc(String villageId, LocalDateTime dateTime);
    List<Meeting> findByVillageIdOrderByDateTimeDesc(String villageId);
}
