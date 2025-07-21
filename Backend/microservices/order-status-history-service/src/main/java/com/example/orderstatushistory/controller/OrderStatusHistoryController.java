package com.example.orderstatushistory.controller;

import com.example.orderstatushistory.dto.OrderStatusHistoryDTO;
import com.example.orderstatushistory.service.OrderStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-status-history")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderStatusHistoryController {
    private final OrderStatusHistoryService orderStatusHistoryService;

    @GetMapping("/order/{orderId}")
    public List<OrderStatusHistoryDTO> getOrderStatusHistory(@PathVariable Long orderId) {
        return orderStatusHistoryService.getOrderStatusHistory(orderId);
    }
} 