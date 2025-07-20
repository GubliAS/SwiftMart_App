package com.example.shoppingcart.dto;

import lombok.Data;

@Data
public class ShoppingCartItemDTO {
    private Long id;
    private Long cartId;
    private Long variantId;
    private String size;
    private int quantity;
} 