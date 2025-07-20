package com.example.shoporder.service;

import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.entity.*;
import com.example.shoporder.mapper.ShopOrderMapper;
import com.example.shoporder.mapper.OrderLineMapper;
import com.example.shoporder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.example.shoporder.client.SiteUserClient;
import com.example.shoporder.client.EmailClient;
import com.example.shoporder.client.ShoppingCartClient;
import com.example.shoporder.client.PromotionClient;
import com.example.shoporder.client.OrderStatusClient;
import com.example.shoporder.client.ShippingMethodClient;
import com.example.shoporder.client.ProductClient;

@Service
@RequiredArgsConstructor
public class ShopOrderService {
    private final ShopOrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final ShopOrderMapper orderMapper;
    private final OrderLineMapper orderLineMapper;
    private final SiteUserClient siteUserClient;
    private final EmailClient emailClient;
    private final ShoppingCartClient shoppingCartClient;
    private final PromotionClient promotionClient;
    private final OrderStatusClient orderStatusClient;
    private final ShippingMethodClient shippingMethodClient;
    private final ProductClient productClient;

    // Implement only basic CRUD for demonstration
    public List<ShopOrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findAll().stream()
                .filter(o -> o.getUserId() != null && o.getUserId().equals(userId))
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderLineDTO> getOrderLines(Long orderId) {
        return orderLineRepository.findAll().stream()
                .filter(l -> l.getOrder() != null && l.getOrder().getId().equals(orderId))
                .map(orderLineMapper::toDto)
                .collect(Collectors.toList());
    }

    // Example usage of Feign clients
    public void notifyUserOfOrder(Long userId, String orderInfo) {
        var user = siteUserClient.getUserById(userId);
        EmailClient.EmailRequest email = new EmailClient.EmailRequest();
        email.setTo(user.getEmailAddress());
        email.setSubject("Order Notification");
        email.setText("Order details: " + orderInfo);
        emailClient.sendEmail(email);
    }

    // Example usage of ShoppingCartClient
    public Object getUserCart(Long userId) {
        return shoppingCartClient.getCartByUser(userId);
    }

    // Example usage of PromotionClient
    public Object getAllPromotions() {
        return promotionClient.getAllPromotions();
    }

    // Example usage of OrderStatusClient
    public Object getAllOrderStatuses() {
        return orderStatusClient.getAllOrderStatuses();
    }

    // Example usage of ShippingMethodClient
    public Object getAllShippingMethods() {
        return shippingMethodClient.getAllShippingMethods();
    }

    // Example usage of ProductClient
    public Object getProductById(Long id) {
        return productClient.getProductById(id);
    }
} 