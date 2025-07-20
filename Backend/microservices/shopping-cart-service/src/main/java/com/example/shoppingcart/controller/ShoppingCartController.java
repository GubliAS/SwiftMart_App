package com.example.shoppingcart.controller;

import com.example.shoppingcart.dto.ShoppingCartDTO;
import com.example.shoppingcart.dto.ShoppingCartItemDTO;
import com.example.shoppingcart.service.ShoppingCartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShoppingCartController {
    private final ShoppingCartService cartService;

    @GetMapping("/user/{userId}")
    public ShoppingCartDTO getCartByUser(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }

    @GetMapping("/{cartId}/items")
    public List<ShoppingCartItemDTO> getItemsByCart(@PathVariable Long cartId) {
        return cartService.getItemsByCartId(cartId);
    }

    @PostMapping("/{cartId}/items")
    public ShoppingCartItemDTO addItemToCart(@PathVariable Long cartId, @RequestBody AddItemRequest request) {
        return cartService.addItemToCart(cartId, request.getProductItemId(), request.getQty());
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long itemId) {
        cartService.removeItemFromCart(itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-info/{userId}")
    public Object getUserInfo(@PathVariable Long userId) {
        return cartService.getUserById(userId);
    }

    @Data
    public static class AddItemRequest {
        private Long productItemId;
        private int qty;
    }
} 