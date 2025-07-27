package com.example.product.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.example.commonentities.SiteUser;

@Entity
@Data
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private LocalDateTime createdAt;
} 