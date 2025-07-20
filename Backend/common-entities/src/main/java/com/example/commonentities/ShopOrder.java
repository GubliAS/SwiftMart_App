package com.example.commonentities;

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

    @Column(name = "user_id")
    private Long userId;

    private LocalDateTime orderDate;

    @Column(name = "payment_method_id")
    private Long paymentMethodId;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_method_id")
    private Long shippingMethodId;

    @Column(name = "order_total")
    private BigDecimal orderTotal;

    @Column(name = "order_status")
    private String orderStatus;
} 