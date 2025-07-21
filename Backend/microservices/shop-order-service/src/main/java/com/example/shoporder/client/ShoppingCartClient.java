package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "shopping-cart-service", url = "${shoppingcart.service.url}")
public interface ShoppingCartClient {
    @GetMapping("/api/cart/user/{userId}")
    Object getCartByUser(@PathVariable("userId") Long userId);

    @GetMapping("/api/cart/{cartId}/items")
    List<Object> getItemsByCart(@PathVariable("cartId") Long cartId);
} 