package com.example.userreview.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.example.commonentities.SiteUser;

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

    @Column(name = "product_id")
    private Long productId;

    @ElementCollection
    private java.util.List<String> images;

    private java.time.LocalDateTime date;
} 