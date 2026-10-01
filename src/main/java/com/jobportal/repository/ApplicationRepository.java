package com.jobportal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.entity.Application;
import com.jobportal.entity.User;
import com.jobportal.entity.Job;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser(User user);

    List<Application> findByJob(Job job);

    List<Application> findByStatus(String status);
    
    Optional<Application> findById(Long id);
    
    boolean existsByUserAndJob(User user, Job job);
}