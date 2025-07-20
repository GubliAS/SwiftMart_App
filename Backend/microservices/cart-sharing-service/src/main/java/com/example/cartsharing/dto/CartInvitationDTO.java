package com.example.cartsharing.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartInvitationDTO {
    private Long id;
    private Long cartId;
    private Long inviterUserId;
    private String inviterEmail;
    private String inviteeEmail;
    private String permission;
    private LocalDateTime invitedAt;
    private LocalDateTime expiresAt;
    private boolean isAccepted;
    private boolean isActive;
} 