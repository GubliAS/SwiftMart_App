package com.example.shoporder.service;

import com.example.shoporder.dto.ShopOrderDTO;
import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.dto.CreateOrderRequest;
import com.example.shoporder.dto.OrderResponse;
import com.example.shoporder.entity.*;
import com.example.shoporder.mapper.ShopOrderMapper;
import com.example.shoporder.mapper.OrderLineMapper;
import com.example.shoporder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import com.example.commonentities.ShopOrder;

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

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Validate request
        if (request.getUserId() == null || request.getOrderLines() == null || request.getOrderLines().isEmpty()) {
            throw new IllegalArgumentException("User ID and order lines are required");
        }

        // Create the order
        ShopOrder order = new ShopOrder();
        order.setUserId(request.getUserId());
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethodId(request.getPaymentMethodId());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingMethodId(request.getShippingMethodId());
        order.setOrderTotal(request.getOrderTotal());
        order.setOrderStatus("PENDING"); // Initial status

        // Save the order
        ShopOrder savedOrder = orderRepository.save(order);

        // Create order lines
        List<OrderLine> orderLines = request.getOrderLines().stream()
                .map(lineRequest -> {
                    OrderLine orderLine = new OrderLine();
                    orderLine.setOrder(savedOrder);
                    
                    // Create a ProductItem for this order line
                    ProductItem productItem = new ProductItem();
                    productItem.setId(lineRequest.getProductItemId());
                    productItem.setPrice(lineRequest.getPrice());
                    orderLine.setProductItem(productItem);
                    
                    orderLine.setQty(lineRequest.getQty());
                    orderLine.setPrice(lineRequest.getPrice());
                    
                    return orderLineRepository.save(orderLine);
                })
                .collect(Collectors.toList());

        // Convert to DTOs for response
        List<OrderLineDTO> orderLineDTOs = orderLines.stream()
                .map(orderLineMapper::toDto)
                .collect(Collectors.toList());

        // Create response
        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getId());
        response.setUserId(savedOrder.getUserId());
        response.setOrderDate(savedOrder.getOrderDate());
        response.setPaymentMethodId(savedOrder.getPaymentMethodId());
        response.setShippingAddress(savedOrder.getShippingAddress());
        response.setShippingMethodId(savedOrder.getShippingMethodId());
        response.setOrderTotal(savedOrder.getOrderTotal());
        response.setOrderStatus(savedOrder.getOrderStatus());
        response.setOrderLines(orderLineDTOs);
        response.setMessage("Order created successfully");

        // Send email notification
        try {
            notifyUserOfOrder(request.getUserId(), "Order #" + savedOrder.getId() + " has been created successfully");
        } catch (Exception e) {
            // Log error but don't fail the order creation
            System.err.println("Failed to send email notification: " + e.getMessage());
        }

        return response;
    }

    // Implement only basic CRUD for demonstration
    public List<ShopOrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findAll().stream()
                .filter(o -> o.getUserId() != null && o.getUserId().equals(userId))
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public ShopOrderDTO getOrderById(Long orderId) {
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        return orderMapper.toDto(order);
    }

    @Transactional
    public ShopOrderDTO updateOrderStatus(Long orderId, String status) {
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        order.setOrderStatus(status);
        ShopOrder updatedOrder = orderRepository.save(order);
        return orderMapper.toDto(updatedOrder);
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