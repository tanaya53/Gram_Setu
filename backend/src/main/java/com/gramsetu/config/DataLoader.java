package com.gramsetu.config;

import com.gramsetu.model.*;
import com.gramsetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SchemeRepository schemeRepository;
    @Autowired
    private SchemeApplicationRepository schemeApplicationRepository;
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private NoticeRepository noticeRepository;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private RationStockRepository rationStockRepository;
    @Autowired
    private RationDistributionRepository rationDistributionRepository;
    @Autowired
    private EmergencyContactRepository emergencyContactRepository;
    @Autowired
    private VillageRepository villageRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking and seeding database...");

        // 1. Seed default village
        if (!villageRepository.existsById("VILL001")) {
            Village v = Village.builder()
                    .villageId("VILL001")
                    .villageName("Rampur")
                    .build();
            villageRepository.save(v);
            System.out.println("Default village Rampur created.");
        }

        // 2. Seed Admin
        User admin;
        if (!userRepository.existsByUsername("admin")) {
            admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Head Admin");
            admin.setRole(Role.ADMIN);
            admin.setVillageId("VILL001");
            admin.setEmail("admin@rampur.gov.in");
            admin.setPhoneNumber("9876543200");
            admin.setWard("Ward 1");
            admin.setAddress("Gram Panchayat Bhavan");
            admin = userRepository.save(admin);
            System.out.println("Admin created.");
        } else {
            admin = userRepository.findByUsername("admin").get();
        }

        // 3. Seed Villager 1 (Demo Villager)
        User villager1;
        if (!userRepository.existsByUsername("villager1")) {
            villager1 = new User();
            villager1.setUsername("villager1");
            villager1.setPassword(passwordEncoder.encode("password123"));
            villager1.setFullName("Rahul Sharma");
            villager1.setRole(Role.VILLAGER);
            villager1.setWard("Ward 1");
            villager1.setVillageId("VILL001");
            villager1.setEmail("rahul@example.com");
            villager1.setPhoneNumber("9876543210");
            villager1.setAddress("House #12, North Lane");
            villager1 = userRepository.save(villager1);
            System.out.println("Villager1 created.");
        } else {
            villager1 = userRepository.findByUsername("villager1").get();
        }

        // 4. Seed Notices / Warnings if count < 5
        if (noticeRepository.count() < 5) {
            noticeRepository.save(Notice.builder()
                    .title("⚠️ HEAVY RAINFALL & FLOOD WARNING")
                    .content("Red alert issued for high rainfall over next 48 hours. Villagers near canal advised to shift livestock to higher ground.")
                    .type(Notice.NoticeType.EMERGENCY)
                    .villageId("VILL001")
                    .build());

            noticeRepository.save(Notice.builder()
                    .title("⚡ Scheduled Power Cut for Substation Upgradation")
                    .content("Electricity board will perform line maintenance this Thursday between 9:00 AM and 3:00 PM.")
                    .type(Notice.NoticeType.MAINTENANCE)
                    .villageId("VILL001")
                    .build());

            noticeRepository.save(Notice.builder()
                    .title("🏥 Free Eye & General Health Checkup Camp")
                    .content("Health camp at Rampur Primary Health Centre this Saturday from 8 AM to 2 PM. Free medicines and eye checkups.")
                    .type(Notice.NoticeType.EVENT)
                    .villageId("VILL001")
                    .build());

            noticeRepository.save(Notice.builder()
                    .title("🌾 Special Ration & Fertilizer Subsidy Announcement")
                    .content("Subsidized nano-urea fertilizer bags and monthly grains now available at central quota depot.")
                    .type(Notice.NoticeType.SCHEME)
                    .villageId("VILL001")
                    .build());

            noticeRepository.save(Notice.builder()
                    .title("💧 Drinking Water Pipeline Chlorination Notice")
                    .content("Overhead water tanks will undergo sanitization tomorrow. Please store adequate drinking water.")
                    .type(Notice.NoticeType.GENERAL)
                    .villageId("VILL001")
                    .build());

            System.out.println("Notices & warnings seeded.");
        }

        // 5. Seed Meetings if count < 5
        if (meetingRepository.count() < 5) {
            meetingRepository.save(Meeting.builder()
                    .title("Annual Gram Sabha Budget & Development Plan")
                    .agenda("Approval of annual village infrastructure development budget and solar street lights.")
                    .dateTime(LocalDateTime.now().plusDays(3))
                    .location("Panchayat Bhavan Hall")
                    .organizer("Sarpanch Office")
                    .status(Meeting.MeetingStatus.SCHEDULED)
                    .villageId("VILL001")
                    .build());

            meetingRepository.save(Meeting.builder()
                    .title("Monsoon Flood Preparedness & Drainage Review")
                    .agenda("Review of emergency rescue kits and clearing blocked culverts along Main Road.")
                    .dateTime(LocalDateTime.now().plusDays(5))
                    .location("Community Centre Ward 2")
                    .organizer("Disaster Relief Committee")
                    .status(Meeting.MeetingStatus.SCHEDULED)
                    .villageId("VILL001")
                    .build());

            meetingRepository.save(Meeting.builder()
                    .title("Farmer Welfare & Solar Pump Subsidies Meeting")
                    .agenda("Demonstration of PM-KUSUM solar agricultural pumps and seed distribution.")
                    .dateTime(LocalDateTime.now().plusDays(8))
                    .location("Farmers Cooperative Hall")
                    .organizer("Agriculture Officer")
                    .status(Meeting.MeetingStatus.SCHEDULED)
                    .villageId("VILL001")
                    .build());

            meetingRepository.save(Meeting.builder()
                    .title("Village Cleanliness & Swachh Bharat Review")
                    .agenda("Review of solid waste door-to-door collection progress and community toilet maintenance.")
                    .dateTime(LocalDateTime.now().minusDays(4))
                    .location("Panchayat Office")
                    .organizer("Village Sanitation Committee")
                    .status(Meeting.MeetingStatus.COMPLETED)
                    .villageId("VILL001")
                    .build());

            meetingRepository.save(Meeting.builder()
                    .title("Youth Skill Training & Employment Drive")
                    .agenda("Briefing on PMKVY vocational courses in solar technician and tailoring.")
                    .dateTime(LocalDateTime.now().minusDays(10))
                    .location("Village Library Room")
                    .organizer("Gram Rozgar Sevak")
                    .status(Meeting.MeetingStatus.COMPLETED)
                    .villageId("VILL001")
                    .build());

            System.out.println("Meetings seeded.");
        }

        // 6. Seed Schemes if count < 5
        if (schemeRepository.count() < 5) {
            Scheme s1 = schemeRepository.save(Scheme.builder()
                    .name("Pradhan Mantri Awas Yojana")
                    .department("Housing")
                    .eligibility("Homeless rural families & kutcha house owners")
                    .description("Financial assistance for construction of pucca houses.")
                    .villageId("VILL001")
                    .active(true)
                    .build());

            Scheme s2 = schemeRepository.save(Scheme.builder()
                    .name("PM-KISAN Samman Nidhi")
                    .department("Agriculture & Farmers Welfare")
                    .eligibility("Small and marginal farmer families with landholding up to 2 hectares")
                    .description("Direct income support of Rs 6,000 per year in 3 equal installments.")
                    .villageId("VILL001")
                    .active(true)
                    .build());

            Scheme s3 = schemeRepository.save(Scheme.builder()
                    .name("Ayushman Bharat - PMJAY Health Cover")
                    .department("Health & Family Welfare")
                    .eligibility("BPL and economically vulnerable households")
                    .description("Cashless health cover up to Rs. 5 Lakhs per family per year for secondary and tertiary hospitalization.")
                    .villageId("VILL001")
                    .active(true)
                    .build());

            Scheme s4 = schemeRepository.save(Scheme.builder()
                    .name("Jal Jeevan Mission - Har Ghar Jal")
                    .department("Drinking Water & Sanitation")
                    .eligibility("All rural households without piped drinking water")
                    .description("Provision of safe tap water connections to every rural home.")
                    .villageId("VILL001")
                    .active(true)
                    .build());

            Scheme s5 = schemeRepository.save(Scheme.builder()
                    .name("MGNREGA Rural Employment Guarantee")
                    .department("Rural Development")
                    .eligibility("Adult members of rural households willing to do manual labour")
                    .description("Guarantees 100 days of wage employment in a financial year.")
                    .villageId("VILL001")
                    .active(true)
                    .build());

            System.out.println("Schemes seeded.");
        }

        // 7. Seed Complaints if count < 5
        if (complaintRepository.count() < 5) {
            complaintRepository.save(Complaint.builder()
                    .title("Road Severely Damaged with Deep Potholes")
                    .description("Connecting road between Market Cross and Primary School has deep craters due to heavy rain. Immediate gravel filling required.")
                    .category("Road Damage")
                    .ward("Ward 2")
                    .status(Complaint.Status.UNDER_REVIEW)
                    .priority(Complaint.Priority.HIGH)
                    .voteCount(18)
                    .user(admin)
                    .build());

            complaintRepository.save(Complaint.builder()
                    .title("Drainage Clog Causing Sewage Overflow")
                    .description("Open drain near Temple chowk is choked with plastic and silt, causing dirty wastewater to backflow onto the pedestrian street.")
                    .category("Drainage")
                    .ward("Ward 1")
                    .status(Complaint.Status.IN_PROGRESS)
                    .priority(Complaint.Priority.HIGH)
                    .voteCount(24)
                    .user(villager1)
                    .build());

            complaintRepository.save(Complaint.builder()
                    .title("Broken Electricity Transformer")
                    .description("Transformer #3 hums loudly with sparks at night. Low voltage is tripping motors across Ward 3.")
                    .category("Electricity")
                    .ward("Ward 3")
                    .status(Complaint.Status.SUBMITTED)
                    .priority(Complaint.Priority.HIGH)
                    .voteCount(15)
                    .user(villager1)
                    .build());

            complaintRepository.save(Complaint.builder()
                    .title("Garbage Dump Accumulation near Market Square")
                    .description("Waste collection trolley has not cleared garbage dump for 4 days. Strong foul odour.")
                    .category("Garbage")
                    .ward("Ward 2")
                    .status(Complaint.Status.RESOLVED)
                    .priority(Complaint.Priority.MEDIUM)
                    .voteCount(9)
                    .user(admin)
                    .build());

            complaintRepository.save(Complaint.builder()
                    .title("Primary School Hand-pump Water Muddy")
                    .description("Handpump water installed inside school compound is coming out reddish-brown and turbid.")
                    .category("Water Supply")
                    .ward("Ward 4")
                    .status(Complaint.Status.SUBMITTED)
                    .priority(Complaint.Priority.MEDIUM)
                    .voteCount(11)
                    .user(villager1)
                    .build());

            System.out.println("Complaints seeded.");
        }

        // 8. Seed Emergency Contacts if count < 5
        if (emergencyContactRepository.count() < 5) {
            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Primary Health Centre Ambulance")
                    .phoneNumber("102")
                    .category("Ambulance")
                    .villageId("VILL001")
                    .build());

            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Rampur Police Station")
                    .phoneNumber("100")
                    .category("Police")
                    .villageId("VILL001")
                    .build());

            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Fire & Rescue Control Room")
                    .phoneNumber("101")
                    .category("Fire")
                    .villageId("VILL001")
                    .build());

            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Sarpanch Office Direct Line")
                    .phoneNumber("98765-43210")
                    .category("Sarpanch")
                    .villageId("VILL001")
                    .build());

            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Disaster & Flood Control Room")
                    .phoneNumber("1077")
                    .category("Disaster Relief")
                    .villageId("VILL001")
                    .build());

            emergencyContactRepository.save(EmergencyContact.builder()
                    .name("Women Helpline")
                    .phoneNumber("1090")
                    .category("Women Safety")
                    .villageId("VILL001")
                    .build());

            System.out.println("Emergency contacts seeded.");
        }

        System.out.println("Seeding check complete.");
    }
}
