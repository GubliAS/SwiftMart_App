package com.example.cartsharing.dto;

import lombok.Data;

@Data
public class InviteUserRequest {
    private Long cartId;
    private String inviteeEmail;
    private String permission;
    private String message;
} 