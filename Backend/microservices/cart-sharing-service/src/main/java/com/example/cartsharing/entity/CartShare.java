package com.example.cartsharing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cart_share")
@Data
public class CartShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String shareToken;

    @Column(nullable = false)
    private Long cartId;

    @Column(nullable = false)
    private Long ownerUserId;

    @Column(nullable = false)
    private String ownerEmail;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SharePermission permission;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        if (shareToken == null) {
            shareToken = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusDays(7); // Default 7 days expiry
        }
        if (!isActive) {
            isActive = true;
        }
    }

    public enum SharePermission {
        VIEW_ONLY,
        EDIT,
        ADMIN
    }
} 