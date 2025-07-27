package com.example.shoporder.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long userId;
    private Long paymentMethodId;
    private String shippingAddress;
    private Long shippingMethodId;
    private BigDecimal orderTotal;
    private List<OrderLineRequest> orderLines;
    
    @Data
    public static class OrderLineRequest {
        private Long productItemId;
        private Integer qty;
        private BigDecimal price;
    }
} 