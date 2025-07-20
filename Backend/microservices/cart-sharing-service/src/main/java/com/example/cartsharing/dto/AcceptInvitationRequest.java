package com.example.cartsharing.dto;

import lombok.Data;

@Data
public class AcceptInvitationRequest {
    private Long invitationId;
    private Long userId;
} 