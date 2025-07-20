package com.example.cartsharing.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartShareDTO {
    private Long id;
    private String shareToken;
    private Long cartId;
    private Long ownerUserId;
    private String ownerEmail;
    private String permission;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean isActive;
    private String shareUrl;
} 