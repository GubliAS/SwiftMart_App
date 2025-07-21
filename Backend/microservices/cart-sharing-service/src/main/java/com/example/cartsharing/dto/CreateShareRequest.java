package com.example.cartsharing.dto;

import lombok.Data;

@Data
public class CreateShareRequest {
    private Long cartId;
    private String permission;
    private Integer expiryDays;
} 