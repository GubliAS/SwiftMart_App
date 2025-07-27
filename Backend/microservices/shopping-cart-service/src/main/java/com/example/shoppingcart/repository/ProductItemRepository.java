package com.example.shoppingcart.repository;

import com.example.shoppingcart.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
} 