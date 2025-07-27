package com.example.shoporder.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.example.commonentities.ShopOrder;
import com.example.commonentities.SiteUser;

@Entity
@Table(name = "order_line")
@Data
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private ShopOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private SiteUser seller;

    private int qty;
    private BigDecimal price;
    
    @Column(name = "item_status")
    private String itemStatus = "pending"; // pending, confirmed, shipped, delivered, received, cancelled
} 