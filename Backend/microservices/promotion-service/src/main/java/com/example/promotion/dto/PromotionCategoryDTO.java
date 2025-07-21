package com.example.promotion.dto;

import com.example.promotion.entity.PromotionCategoryId;
import lombok.Data;

@Data
public class PromotionCategoryDTO {
    private PromotionCategoryId id;
    private Long categoryId;
    private Long promotionId;
} 