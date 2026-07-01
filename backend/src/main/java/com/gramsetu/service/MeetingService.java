package com.gramsetu.service;

import com.gramsetu.model.Meeting;
import com.gramsetu.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    public List<Meeting> getUpcomingMeetings(String villageId) {
        return meetingRepository.findByVillageIdAndDateTimeAfterOrderByDateTimeAsc(villageId, LocalDateTime.now());
    }

    public Meeting scheduleMeeting(Meeting meeting, String villageId) {
        meeting.setVillageId(villageId);
        return meetingRepository.save(meeting);
    }

    public Meeting updateMeetingStatus(Long id, Meeting.MeetingStatus status) {
        Meeting meeting = meetingRepository.findById(id).orElseThrow(() -> new RuntimeException("Meeting not found"));
        meeting.setStatus(status);
        return meetingRepository.save(meeting);
    }

    public List<Meeting> getAllMeetings(String villageId) {
        return meetingRepository.findByVillageIdOrderByDateTimeDesc(villageId);
    }

    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }
}
