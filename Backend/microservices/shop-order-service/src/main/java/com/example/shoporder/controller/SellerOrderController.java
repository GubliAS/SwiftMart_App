package com.example.shoporder.controller;

import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.service.SellerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SellerOrderController {
    private final SellerOrderService sellerOrderService;

    /**
     * Get all orders that contain items from a specific seller
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ShopOrderDTO>> getOrdersBySeller(@PathVariable Long sellerId) {
        try {
            List<ShopOrderDTO> orders = sellerOrderService.getOrdersBySeller(sellerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all order lines for a specific seller
     */
    @GetMapping("/seller/{sellerId}/items")
    public ResponseEntity<List<OrderLineDTO>> getOrderLinesBySeller(@PathVariable Long sellerId) {
        try {
            List<OrderLineDTO> orderLines = sellerOrderService.getOrderLinesBySeller(sellerId);
            return ResponseEntity.ok(orderLines);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get order lines for a specific order by seller
     */
    @GetMapping("/order/{orderId}/seller/{sellerId}")
    public ResponseEntity<List<OrderLineDTO>> getOrderLinesByOrderAndSeller(
            @PathVariable Long orderId, 
            @PathVariable Long sellerId) {
        try {
            List<OrderLineDTO> orderLines = sellerOrderService.getOrderLinesByOrderAndSeller(orderId, sellerId);
            return ResponseEntity.ok(orderLines);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update item status for a specific order line
     */
    @PutMapping("/item/{orderLineId}/status")
    public ResponseEntity<OrderLineDTO> updateItemStatus(
            @PathVariable Long orderLineId,
            @RequestParam String status) {
        try {
            OrderLineDTO updatedOrderLine = sellerOrderService.updateItemStatus(orderLineId, status);
            return ResponseEntity.ok(updatedOrderLine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Check and update order status based on item statuses
     */
    @PutMapping("/order/{orderId}/check-status")
    public ResponseEntity<Void> checkAndUpdateOrderStatus(@PathVariable Long orderId) {
        try {
            sellerOrderService.checkAndUpdateOrderStatus(orderId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 