package com.example.userreview.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_review")
@Data
public class UserReview {
    @Id
    private Long id;

    @Column(name = "ordered_product_id")
    private Long orderedProductId;

    @Column(name = "rating_value")
    private Integer ratingValue;

    private String comment;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "user_id")
    private Long userId;

    @ElementCollection
    private java.util.List<String> images;

    private java.time.LocalDateTime date;
} 