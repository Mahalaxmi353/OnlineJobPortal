# Online Job Portal

## 📌 Project Overview

Online Job Portal is a web-based application developed using **Java and Spring Boot** that helps candidates search and apply for jobs, while recruiters can create and manage job postings.

The project provides a simple platform to connect candidates with recruiters and manage the job application process.

## 🚀 Features

* Candidate registration
* Recruiter registration
* User management
* Create and manage job postings
* Search jobs by title, location, and skills
* Filter jobs based on salary and experience
* Apply for jobs
* Prevent duplicate job applications
* View and manage job applications
* Update application status
* Basic role-based access control

## 👥 User Roles

### Candidate

* Register and manage account
* Search for available jobs
* Apply for jobs
* View application status

### Recruiter

* Register and manage account
* Create job postings
* Update and delete jobs
* View applications
* Update application status

> Note: The current version of the project includes Candidate and Recruiter roles. An Admin role has not been implemented yet.

## 🛠️ Technologies Used

* **Java**
* **Spring Boot**
* **Spring Data JPA**
* **Spring Security**
* **PostgreSQL**
* **Hibernate**
* **Maven**
* **HTML**
* **CSS**
* **JavaScript**
* **REST APIs**

## 🗄️ Database

The project uses **PostgreSQL** as the database.

Main entities include:

* User
* Job
* Job Application
* Recruiter

## 📂 Project Structure

```text
OnlineJobPortal
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.jobportal
│   │   │
│   │   └── resources
│   │       └── application.properties
│   │
├── pom.xml
├── .gitignore
└── README.md
```

## ⚙️ How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Mahalaxmi353/OnlineJobPortal.git
```

### 2. Open the project

Open the project in **Spring Tool Suite (STS)** or another Java IDE.

### 3. Configure PostgreSQL

Create a PostgreSQL database named:

```text
jobportal
```

Configure your database credentials using environment variables rather than committing your password to GitHub.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobportal
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

### 4. Run the application

Run the Spring Boot main application class.

The application runs on:

```text
http://localhost:8081
```

## 🔐 Security

Sensitive information such as database passwords should not be stored directly in the source code.

The project uses environment variables for database credentials, and files containing local secrets are excluded using `.gitignore`.

## 📌 Future Enhancements

* Admin role and dashboard
* JWT-based authentication
* Resume upload
* Email notifications
* Advanced job recommendations
* Improved frontend UI
* Pagination and sorting

## 👩‍💻 Developer

**Mahalaxmi Padashetty**

GitHub: https://github.com/Mahalaxmi353
