package com.example.shoppingcart.dto;

import lombok.Data;

@Data
public class ShoppingCartDTO {
    private Long id;
    private Long userId;
    private String name;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private java.util.List<ShoppingCartItemDTO> items;
} 