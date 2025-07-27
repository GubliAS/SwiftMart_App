package com.example.shoporder.controller;

import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.dto.CreateOrderRequest;
import com.example.shoporder.dto.OrderResponse;
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

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse response = orderService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            OrderResponse errorResponse = new OrderResponse();
            errorResponse.setMessage("Failed to create order: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ShopOrderDTO> getOrderById(@PathVariable Long orderId) {
        try {
            ShopOrderDTO order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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
            @RequestParam String status) {
        try {
            ShopOrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 