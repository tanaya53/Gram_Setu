package com.gramsetu.service;

import com.gramsetu.model.Notice;
import com.gramsetu.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices(String villageId) {
        return noticeRepository.findByVillageIdOrderByCreatedAtDesc(villageId);
    }

    public Notice createNotice(Notice notice, String villageId) {
        notice.setVillageId(villageId);
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
