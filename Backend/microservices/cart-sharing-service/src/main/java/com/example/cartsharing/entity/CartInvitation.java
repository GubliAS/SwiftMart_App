package com.example.cartsharing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_invitation")
@Data
public class CartInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cartId;

    @Column(nullable = false)
    private Long inviterUserId;

    @Column(nullable = false)
    private String inviterEmail;

    @Column(nullable = false)
    private String inviteeEmail;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CartShare.SharePermission permission;

    @Column(nullable = false)
    private LocalDateTime invitedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean isAccepted;

    @Column(nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        if (invitedAt == null) {
            invitedAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusDays(7); // Default 7 days expiry
        }
        if (!isActive) {
            isActive = true;
        }
    }
} 