package com.example.userreview.dto;

import lombok.Data;

@Data
public class UserReviewDTO {
    private Long id;
    private Long userId;
    private Long orderedProductId;
    private Integer ratingValue;
    private String comment;
    private Long productId;
    private java.util.List<String> images;
    private java.time.LocalDateTime date;
} 