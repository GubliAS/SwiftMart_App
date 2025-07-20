package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_review")
@Data
public class UserReview {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @Column(name = "ordered_product_id")
    private Long orderedProductId;

    @Column(name = "rating_value")
    private Integer ratingValue;

    private String comment;
} 