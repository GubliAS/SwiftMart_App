package com.example.orderstatushistory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.example.commonentities.ShopOrder;
import com.example.commonentities.OrderStatus;

@Entity
@Table(name = "order_status_history")
@Data
public class OrderStatusHistory {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private ShopOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private OrderStatus status;

    private LocalDateTime changedAt;

    public ShopOrder getOrder() {
        return order;
    }

    public void setOrder(ShopOrder order) {
        this.order = order;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
} 