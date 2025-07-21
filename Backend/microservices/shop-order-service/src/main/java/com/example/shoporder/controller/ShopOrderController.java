package com.example.shoporder.controller;

import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.service.ShopOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShopOrderController {
    private final ShopOrderService orderService;

    @GetMapping("/user/{userId}")
    public List<ShopOrderDTO> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}/lines")
    public List<OrderLineDTO> getOrderLines(@PathVariable Long orderId) {
        return orderService.getOrderLines(orderId);
    }
} 