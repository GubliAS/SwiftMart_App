package com.example.orderstatushistory.repository;

import com.example.orderstatushistory.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    @Query("SELECT osh FROM OrderStatusHistory osh WHERE osh.order.id = :orderId ORDER BY osh.changedAt ASC")
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(@Param("orderId") Long orderId);
} 