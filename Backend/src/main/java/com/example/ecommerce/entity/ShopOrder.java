package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_order")
@Data
public class ShopOrder {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    private LocalDateTime orderDate;

    @Column(name = "payment_method_id")
    private Long paymentMethodId;

    @Column(name = "shipping_address")
    private String shippingAddress;

    // ... existing code ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_method_id")
    private ShippingMethod shippingMethod;
// ... remove or comment out the old shippingMethod string field ...

    @Column(name = "order_total")
    private BigDecimal orderTotal;

    @Column(name = "order_status")
    private String orderStatus;
} 