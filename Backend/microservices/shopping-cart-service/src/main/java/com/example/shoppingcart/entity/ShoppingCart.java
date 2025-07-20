package com.example.shoppingcart.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.example.commonentities.SiteUser;

@Entity
@Table(name = "shopping_cart")
@Data
public class ShoppingCart {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    private String name;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
} 