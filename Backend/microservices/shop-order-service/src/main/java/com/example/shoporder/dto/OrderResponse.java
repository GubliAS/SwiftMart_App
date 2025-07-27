package com.example.shoporder.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private LocalDateTime orderDate;
    private Long paymentMethodId;
    private String shippingAddress;
    private Long shippingMethodId;
    private BigDecimal orderTotal;
    private String orderStatus;
    private List<OrderLineDTO> orderLines;
    private String message;
} 