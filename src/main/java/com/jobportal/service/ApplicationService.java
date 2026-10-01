package com.jobportal.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public Application applyForJob(Application application) {

        Long userId = application.getUser().getId();
        Long jobId = application.getJob().getId();

        User user = userRepository.findById(userId).orElse(null);
        Job job = jobRepository.findById(jobId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (job == null) {
            throw new RuntimeException("Job not found");
        }

        if (applicationRepository.existsByUserAndJob(user, job)) {
            throw new RuntimeException(
                    "You have already applied for this job");
        }

        application.setUser(user);
        application.setJob(job);

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public List<Application> getApplicationsByUser(User user) {
        return applicationRepository.findByUser(user);
    }

    public List<Application> getApplicationsByJob(Job job) {
        return applicationRepository.findByJob(job);
    }

    public List<Application> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    public List<Application> getApplicationsByUserId(Long userId) {
        User user = new User();
        user.setId(userId);

        return applicationRepository.findByUser(user);
    }

    public List<Application> getApplicationsByJobId(Long jobId) {
        Job job = new Job();
        job.setId(jobId);

        return applicationRepository.findByJob(job);
    }

    public Application updateStatus(Long applicationId, String status) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElse(null);

        if (application == null) {
            throw new RuntimeException("Application not found");
        }

        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Status is required");
        }

        status = status.trim().toUpperCase();

        if (!status.equals("APPLIED")
                && !status.equals("SHORTLISTED")
                && !status.equals("SELECTED")
                && !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid status. Use APPLIED, SHORTLISTED, SELECTED or REJECTED");
        }

        application.setStatus(status);

        return applicationRepository.save(application);
    }
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}