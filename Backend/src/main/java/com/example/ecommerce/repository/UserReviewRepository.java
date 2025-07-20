package com.example.ecommerce.repository;

import com.example.ecommerce.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReviewRepository extends JpaRepository<UserReview, Long> {
} 