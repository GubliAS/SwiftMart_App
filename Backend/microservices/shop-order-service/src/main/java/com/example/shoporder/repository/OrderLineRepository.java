package com.example.shoporder.repository;

import com.example.shoporder.entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    
    /**
     * Find all order lines for a specific seller
     */
    List<OrderLine> findBySellerId(Long sellerId);
    
    /**
     * Find all order lines for a specific order
     */
    List<OrderLine> findByOrderId(Long orderId);
    
    /**
     * Find all order lines for a specific order and seller
     */
    List<OrderLine> findByOrderIdAndSellerId(Long orderId, Long sellerId);
    
    /**
     * Find distinct order IDs that contain items from a specific seller
     */
    @Query("SELECT DISTINCT ol.order.id FROM OrderLine ol WHERE ol.seller.id = :sellerId")
    List<Long> findDistinctOrderIdsBySellerId(@Param("sellerId") Long sellerId);
} 