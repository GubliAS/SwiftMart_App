package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
} 