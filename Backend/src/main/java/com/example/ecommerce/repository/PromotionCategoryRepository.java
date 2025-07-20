package com.example.ecommerce.repository;

import com.example.ecommerce.entity.PromotionCategory;
import com.example.ecommerce.entity.PromotionCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionCategoryRepository extends JpaRepository<PromotionCategory, PromotionCategoryId> {
} 