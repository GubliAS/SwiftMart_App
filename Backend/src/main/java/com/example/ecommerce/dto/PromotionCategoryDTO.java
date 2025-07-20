package com.example.ecommerce.dto;

import com.example.ecommerce.entity.PromotionCategoryId;
import lombok.Data;

@Data
public class PromotionCategoryDTO {
    private PromotionCategoryId id;
    private Long categoryId;
    private Long promotionId;
} 