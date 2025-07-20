package com.example.ecommerce.dto;

import lombok.Data;

@Data
public class UserReviewDTO {
    private Long id;
    private Long userId;
    private Long orderedProductId;
    private Integer ratingValue;
    private String comment;
} 