package com.example.shoppingcart.repository;

import com.example.shoppingcart.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {
    List<ShoppingCartItem> findByCartId(Long cartId);
} 