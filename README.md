<h1 align="center">🏛️ Gram Setu — Civic Management Platform</h1>

<p align="center">
  A full-stack civic management platform enabling residents to submit and track grievances digitally, replacing in-person visits with a role-based digital workflow.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=spring&logoColor=white" />
</p>

> 🏆 **Acknowledged by a Gram Panchayat** for its practical contribution to local civic administration. [View acknowledgment letter](#) <!-- link your Drive letter here -->

---

## 📸 Screenshots

<!-- Add 2-4 screenshots or a short GIF walkthrough here — this is the single highest-impact addition you can make.
Example:
![Dashboard](screenshots/dashboard.png)
![Grievance Form](screenshots/grievance-form.png)
-->

---

## ✨ Features

- **Grievance Management** — residents submit and track complaints digitally, replacing manual paperwork
- **Role-Based Access Control** — separate permissions for Admin, Official, and Resident roles
- **Government Schemes** — centralized listing of available schemes for residents
- **Public Announcements** — village-wide notices published digitally
- **Village Meeting Records** — scheduling and minutes tracking
- **Ration Distribution Tracking** — digitized record-keeping for local officials

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Java, Spring Security (JWT) |
| Database | PostgreSQL |
| ORM | Hibernate |
| Auth | JWT-based role authentication |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/tanaya53/Gram_Setu.git
cd Gram_Setu

# Backend setup
cd backend
./mvnw spring-boot:run

# Frontend setup (in a new terminal)
cd frontend
npm install
npm start
```

### Environment Variables
Create a `.env` file in the backend directory:
```
DB_URL=jdbc:postgresql://localhost:5432/gramsetu
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

---

## 📂 Project Structure

```
Gram_Setu/
├── backend/
│   ├── src/main/java/       # Spring Boot application
│   └── src/main/resources/  # Config files
├── frontend/
│   ├── src/components/      # React components
│   └── src/services/        # API service calls
└── README.md
```

---

## 🎯 What This Project Demonstrates

- End-to-end full-stack development from database schema to UI
- Secure authentication and role-based authorization design
- Working with a real institutional stakeholder to gather requirements and iterate

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/tanaya53">Tanaya Sawant</a></p>
