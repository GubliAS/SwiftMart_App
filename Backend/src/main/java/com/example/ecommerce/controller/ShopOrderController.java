package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ShopOrderDTO;
import com.example.ecommerce.dto.OrderLineDTO;
import com.example.ecommerce.service.ShopOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class ShopOrderController {
    private final ShopOrderService orderService;

    @PostMapping("/place/{userId}")
    public ResponseEntity<ShopOrderDTO> placeOrder(@PathVariable Long userId, @RequestParam Long shippingMethodId) {
        ShopOrderDTO order = orderService.placeOrder(userId, shippingMethodId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public List<ShopOrderDTO> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}/lines")
    public List<OrderLineDTO> getOrderLines(@PathVariable Long orderId) {
        return orderService.getOrderLines(orderId);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ShopOrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Long statusId) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, statusId));
    }
} 