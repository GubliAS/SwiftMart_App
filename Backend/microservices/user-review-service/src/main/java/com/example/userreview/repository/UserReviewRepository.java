package com.example.userreview.repository;

import com.example.userreview.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReviewRepository extends JpaRepository<UserReview, Long> {
} 