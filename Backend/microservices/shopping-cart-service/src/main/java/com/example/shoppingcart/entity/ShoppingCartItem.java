package com.example.shoppingcart.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shopping_cart_item")
@Data
public class ShoppingCartItem {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private ShoppingCart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private com.example.commonentities.ProductVariant variant;

    private String size;
    private int quantity;
} 