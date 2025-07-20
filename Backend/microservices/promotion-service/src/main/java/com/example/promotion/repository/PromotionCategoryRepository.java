package com.example.promotion.repository;

import com.example.promotion.entity.PromotionCategory;
import com.example.promotion.entity.PromotionCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionCategoryRepository extends JpaRepository<PromotionCategory, PromotionCategoryId> {
} 