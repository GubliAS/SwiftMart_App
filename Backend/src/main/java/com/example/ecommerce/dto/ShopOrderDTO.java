package com.example.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShopOrderDTO {
    private Long id;
    private Long userId;
    private LocalDateTime orderDate;
    private Long paymentMethodId;
    private String shippingAddress;
    private Long shippingMethodId;
    private BigDecimal orderTotal;
    private String orderStatus;
} 