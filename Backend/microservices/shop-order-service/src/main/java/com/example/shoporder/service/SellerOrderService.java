package com.example.shoporder.service;

import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.entity.OrderLine;
import com.example.commonentities.ShopOrder;
import com.example.shoporder.mapper.OrderLineMapper;
import com.example.shoporder.mapper.ShopOrderMapper;
import com.example.shoporder.repository.OrderLineRepository;
import com.example.shoporder.repository.ShopOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerOrderService {
    private final OrderLineRepository orderLineRepository;
    private final ShopOrderRepository orderRepository;
    private final OrderLineMapper orderLineMapper;
    private final ShopOrderMapper orderMapper;

    /**
     * Get all order lines for a specific seller
     */
    public List<OrderLineDTO> getOrderLinesBySeller(Long sellerId) {
        return orderLineRepository.findBySellerId(sellerId)
                .stream()
                .map(orderLineMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all orders that contain items from a specific seller
     */
    public List<ShopOrderDTO> getOrdersBySeller(Long sellerId) {
        List<Long> orderIds = orderLineRepository.findDistinctOrderIdsBySellerId(sellerId);
        return orderRepository.findAllById(orderIds)
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Update item status for a specific order line
     */
    @Transactional
    public OrderLineDTO updateItemStatus(Long orderLineId, String newStatus) {
        OrderLine orderLine = orderLineRepository.findById(orderLineId)
                .orElseThrow(() -> new IllegalArgumentException("Order line not found"));
        
        orderLine.setItemStatus(newStatus);
        OrderLine updatedOrderLine = orderLineRepository.save(orderLine);
        
        // Check if all items in the order are received
        checkAndUpdateOrderStatus(orderLine.getOrder().getId());
        
        return orderLineMapper.toDto(updatedOrderLine);
    }

    /**
     * Check if all items in an order are received and update order status accordingly
     */
    @Transactional
    public void checkAndUpdateOrderStatus(Long orderId) {
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        List<OrderLine> orderLines = orderLineRepository.findByOrderId(orderId);
        
        // Check if all items are received
        boolean allReceived = orderLines.stream()
                .allMatch(line -> "received".equalsIgnoreCase(line.getItemStatus()));
        
        // Check if any items are cancelled
        boolean anyCancelled = orderLines.stream()
                .anyMatch(line -> "cancelled".equalsIgnoreCase(line.getItemStatus()));
        
        // Update order status based on item statuses
        if (anyCancelled) {
            order.setOrderStatus("cancelled");
        } else if (allReceived) {
            order.setOrderStatus("received");
        } else {
            // Check if any items are still pending
            boolean anyPending = orderLines.stream()
                    .anyMatch(line -> "pending".equalsIgnoreCase(line.getItemStatus()));
            
            if (anyPending) {
                order.setOrderStatus("pending");
            } else {
                // If no pending items, check if any are shipped/delivered
                boolean anyShipped = orderLines.stream()
                        .anyMatch(line -> "shipped".equalsIgnoreCase(line.getItemStatus()) || 
                                        "delivered".equalsIgnoreCase(line.getItemStatus()));
                
                if (anyShipped) {
                    order.setOrderStatus("in_progress");
                }
            }
        }
        
        orderRepository.save(order);
    }

    /**
     * Get order lines for a specific order by seller
     */
    public List<OrderLineDTO> getOrderLinesByOrderAndSeller(Long orderId, Long sellerId) {
        return orderLineRepository.findByOrderIdAndSellerId(orderId, sellerId)
                .stream()
                .map(orderLineMapper::toDto)
                .collect(Collectors.toList());
    }
} 