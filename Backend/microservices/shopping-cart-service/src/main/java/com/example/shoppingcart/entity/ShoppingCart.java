package com.example.shoppingcart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "shopping_cart")
@Data
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    private String createdBy; // user email or id

    @ElementCollection
    private List<String> invitedEmails;
} 