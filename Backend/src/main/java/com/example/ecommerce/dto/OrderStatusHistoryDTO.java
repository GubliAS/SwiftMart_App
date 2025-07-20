package com.example.ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderStatusHistoryDTO {
    private Long id;
    private Long orderId;
    private Long statusId;
    private LocalDateTime changedAt;
} 