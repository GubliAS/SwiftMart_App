package com.example.orderstatushistory.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderStatusHistoryDTO {
    private Long id;
    private Long orderId;
    private Long statusId;
    private LocalDateTime changedAt;
} 