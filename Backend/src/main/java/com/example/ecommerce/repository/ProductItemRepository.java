package com.example.ecommerce.repository;

import com.example.ecommerce.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    // Add custom queries if needed
} 