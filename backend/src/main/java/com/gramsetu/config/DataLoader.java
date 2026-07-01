package com.gramsetu.config;

import com.gramsetu.model.*;
import com.gramsetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SchemeRepository schemeRepository;
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private VillageRepository villageRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Seeding database...");

        // Seed default village
        if (!villageRepository.existsById("VILL001")) {
            Village v = Village.builder()
                    .villageId("VILL001")
                    .villageName("Rampur")
                    .build();
            villageRepository.save(v);
            System.out.println("Default village Rampur created.");
        }

        User admin;
        if (!userRepository.existsByUsername("admin")) {
            admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Head Admin");
            admin.setRole(Role.ADMIN);
            admin.setVillageId("VILL001");
            admin = userRepository.save(admin);
            System.out.println("Admin created.");
        } else {
            admin = userRepository.findByUsername("admin").get();
        }

        if (!userRepository.existsByUsername("villager1")) {
            User v1 = new User();
            v1.setUsername("villager1");
            v1.setPassword(passwordEncoder.encode("password123"));
            v1.setFullName("Rahul Sharma");
            v1.setRole(Role.VILLAGER);
            v1.setWard("Ward 1");
            v1.setVillageId("VILL001");
            userRepository.save(v1);
            System.out.println("Villager1 created.");
        }

        if (complaintRepository.count() == 0) {
            Complaint c1 = new Complaint();
            c1.setTitle("Leaking Water Pipe");
            c1.setDescription("The main pipe near the temple is leaking for 3 days.");
            c1.setCategory("Water Supply");
            c1.setStatus(Complaint.Status.SUBMITTED);
            c1.setPriority(Complaint.Priority.LOW);
            c1.setVoteCount(5);
            c1.setUser(admin); // Set required field
            complaintRepository.save(c1);

            Complaint c2 = new Complaint();
            c2.setTitle("Street Light Not Working");
            c2.setDescription("Entrance road lights are off. Dangerous at night.");
            c2.setCategory("Electricity");
            c2.setStatus(Complaint.Status.UNDER_REVIEW);
            c2.setPriority(Complaint.Priority.MEDIUM);
            c2.setVoteCount(12);
            c2.setUser(admin); // Set required field
            complaintRepository.save(c2);

            System.out.println("Complaints created.");
        }

        if (schemeRepository.count() == 0) {
            Scheme s1 = new Scheme();
            s1.setName("Pradhan Mantri Awas Yojana");
            s1.setDepartment("Housing");
            s1.setEligibility("Homeless families");
            s1.setDescription("Financial assistance for building houses.");
            s1.setVillageId("VILL001");
            schemeRepository.save(s1);
            System.out.println("Schemes created.");
        }
        
        System.out.println("Seeding complete.");
    }
}
