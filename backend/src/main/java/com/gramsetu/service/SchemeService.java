package com.gramsetu.service;

import com.gramsetu.model.Scheme;
import com.gramsetu.model.SchemeApplication;
import com.gramsetu.model.User;
import com.gramsetu.repository.SchemeApplicationRepository;
import com.gramsetu.repository.SchemeRepository;
import com.gramsetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SchemeService {
    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private SchemeApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Scheme> getAllSchemes(String villageId) {
        return schemeRepository.findByVillageId(villageId);
    }

    public Scheme createScheme(Scheme scheme, String villageId) {
        scheme.setVillageId(villageId);
        return schemeRepository.save(scheme);
    }

    public SchemeApplication applyForScheme(Long schemeId, Long userId, String docsUrl) {
        Scheme scheme = schemeRepository.findById(schemeId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        SchemeApplication application = SchemeApplication.builder()
                .scheme(scheme)
                .user(user)
                .documentsUrl(docsUrl)
                .status(SchemeApplication.ApplicationStatus.PENDING)
                .build();
        
        return applicationRepository.save(application);
    }

    public List<SchemeApplication> getMyApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<SchemeApplication> getAllApplications(String villageId) {
        return applicationRepository.findByUser_VillageId(villageId);
    }

    public SchemeApplication updateApplicationStatus(Long id, SchemeApplication.ApplicationStatus status) {
        SchemeApplication app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public Scheme updateSchemeStatus(Long id, boolean active) {
        Scheme scheme = schemeRepository.findById(id).orElseThrow(() -> new RuntimeException("Scheme not found"));
        scheme.setActive(active);
        return schemeRepository.save(scheme);
    }

    @Transactional
    public void deleteScheme(Long id) {
        applicationRepository.deleteBySchemeId(id);
        schemeRepository.deleteById(id);
    }
}
