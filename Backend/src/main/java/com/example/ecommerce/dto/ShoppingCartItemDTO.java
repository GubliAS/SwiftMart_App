package com.example.ecommerce.dto;

import lombok.Data;

@Data
public class ShoppingCartItemDTO {
    private Long id;
    private Long cartId;
    private Long productItemId;
    private int qty;
} 