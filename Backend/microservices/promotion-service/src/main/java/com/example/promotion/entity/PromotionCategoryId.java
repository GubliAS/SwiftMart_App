package com.example.promotion.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class PromotionCategoryId implements java.io.Serializable {
    private Long categoryId;
    private Long promotionId;
} 