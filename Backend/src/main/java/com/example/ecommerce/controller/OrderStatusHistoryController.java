package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderStatusHistoryDTO;
import com.example.ecommerce.service.OrderStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-status-history")
@RequiredArgsConstructor
public class OrderStatusHistoryController {
    private final OrderStatusHistoryService orderStatusHistoryService;

    @GetMapping("/order/{orderId}")
    public List<OrderStatusHistoryDTO> getOrderStatusHistory(@PathVariable Long orderId) {
        return orderStatusHistoryService.getOrderStatusHistory(orderId);
    }
} 