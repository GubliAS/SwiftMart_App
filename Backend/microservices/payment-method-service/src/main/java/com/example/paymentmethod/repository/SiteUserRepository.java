package com.example.paymentmethod.repository;

import com.example.commonentities.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteUserRepository extends JpaRepository<SiteUser, Long> {
} 