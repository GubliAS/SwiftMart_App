package com.example.ecommerce.service;

import com.example.ecommerce.dto.ShopOrderDTO;
import com.example.ecommerce.dto.OrderLineDTO;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.mapper.ShopOrderMapper;
import com.example.ecommerce.mapper.OrderLineMapper;
import com.example.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.OrderStatusHistoryRepository;
import com.example.ecommerce.mapper.OrderStatusHistoryMapper;
import java.time.LocalDateTime;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.example.ecommerce.exception.InvalidOperationException;

@Service
@RequiredArgsConstructor
public class ShopOrderService {
    private final ShopOrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final ShoppingCartRepository cartRepository;
    private final ShoppingCartItemRepository cartItemRepository;
    private final SiteUserRepository userRepository;
    private final ShopOrderMapper orderMapper;
    private final OrderLineMapper orderLineMapper;
    private final PromotionRepository promotionRepository;
    private final PromotionCategoryRepository promotionCategoryRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;
    private final ShippingMethodRepository shippingMethodRepository;
    private final ProductItemRepository productItemRepository;
    private final EmailService emailService;

    public ShopOrderDTO placeOrder(Long userId, Long shippingMethodId) {
        SiteUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ShoppingCart cart = cartRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<ShoppingCartItem> cartItems = cartItemRepository.findAll().stream()
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .collect(Collectors.toList());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        ShippingMethod shippingMethod = null;
        if (shippingMethodId != null) {
            shippingMethod = shippingMethodRepository.findById(shippingMethodId)
                .orElseThrow(() -> new RuntimeException("Shipping method not found"));
        }

        ShopOrder order = new ShopOrder();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("PLACED");
        order.setOrderTotal(BigDecimal.ZERO);
        order.setShippingMethod(shippingMethod);
        order = orderRepository.save(order);

        // Record initial status history
        OrderStatus placedStatus = orderStatusRepository.findAll().stream()
            .filter(s -> "PLACED".equalsIgnoreCase(s.getStatus()))
            .findFirst().orElse(null);
        if (placedStatus != null) {
            OrderStatusHistory history = new OrderStatusHistory();
            history.setOrder(order);
            history.setStatus(placedStatus);
            history.setChangedAt(LocalDateTime.now());
            orderStatusHistoryRepository.save(history);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (ShoppingCartItem cartItem : cartItems) {
            OrderLine line = new OrderLine();
            line.setOrder(order);
            line.setProductItem(cartItem.getProductItem());
            line.setQty(cartItem.getQty());
            // Inventory management
            ProductItem productItem = cartItem.getProductItem();
            if (cartItem.getQty() > productItem.getQtyInStock()) {
                throw new InvalidOperationException("Not enough stock for product: " + productItem.getId());
            }
            productItem.setQtyInStock(productItem.getQtyInStock() - cartItem.getQty());
            productItemRepository.save(productItem);
            line.setPrice(productItem.getPrice());
            orderLineRepository.save(line);
            total = total.add(line.getPrice().multiply(BigDecimal.valueOf(line.getQty())));
        }
        order.setOrderTotal(total);
        orderRepository.save(order);

        // Optionally clear cart
        cartItemRepository.deleteAll(cartItems);

        emailService.sendEmail(
            user.getEmailAddress(),
            "Order Confirmation",
            "Thank you for your order! Your order ID is: " + order.getId()
        );

        return orderMapper.toDto(order);
    }

    public List<ShopOrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findAll().stream()
                .filter(o -> o.getUser().getId().equals(userId))
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderLineDTO> getOrderLines(Long orderId) {
        return orderLineRepository.findAll().stream()
                .filter(l -> l.getOrder().getId().equals(orderId))
                .map(orderLineMapper::toDto)
                .collect(Collectors.toList());
    }

    public ShopOrderDTO updateOrderStatus(Long orderId, Long statusId) {
        ShopOrder order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderStatus status = orderStatusRepository.findById(statusId)
            .orElseThrow(() -> new ResourceNotFoundException("Order status not found"));
        order.setOrderStatus(status.getStatus());
        orderRepository.save(order);
        // Record status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setStatus(status);
        history.setChangedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(history);
        return orderMapper.toDto(order);
    }
} 