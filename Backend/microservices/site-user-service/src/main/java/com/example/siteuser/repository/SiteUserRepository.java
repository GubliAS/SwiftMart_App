package com.example.siteuser.repository;

import com.example.siteuser.entity.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SiteUserRepository extends JpaRepository<SiteUser, Long> {
    Optional<SiteUser> findByEmailAddress(String emailAddress);
} 