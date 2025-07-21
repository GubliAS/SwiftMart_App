package com.example.shoporder.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.example.commonentities.ShopOrder;

@Entity
@Table(name = "order_line")
@Data
public class OrderLine {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private ShopOrder order;

    private int qty;
    private BigDecimal price;
} 