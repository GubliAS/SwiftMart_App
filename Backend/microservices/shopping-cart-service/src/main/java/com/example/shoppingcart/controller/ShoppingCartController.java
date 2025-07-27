package com.example.shoppingcart.controller;

import com.example.shoppingcart.dto.ShoppingCartDTO;
import com.example.shoppingcart.dto.ShoppingCartItemDTO;
import com.example.shoppingcart.dto.MergeCartRequest;
import com.example.shoppingcart.service.ShoppingCartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShoppingCartController {
    private final ShoppingCartService cartService;
    private static final Logger logger = LoggerFactory.getLogger(ShoppingCartController.class);

    @PostMapping
    public ShoppingCartDTO createCart(@RequestBody CreateCartRequest request) {
        return cartService.createCart(request.getName(), request.getCreatedBy());
    }

    @GetMapping("/user/{userEmail}")
    public List<ShoppingCartDTO> getAllCartsForUser(@PathVariable String userEmail) {
        return cartService.getAllCartsForUser(userEmail);
    }

    @GetMapping("/debug/all")
    public List<ShoppingCartDTO> getAllCarts() {
        return cartService.getAllCarts();
    }

    @PostMapping("/{cartId}/invite")
    public ResponseEntity<Void> inviteUserToCart(@PathVariable Long cartId, @RequestBody InviteRequest request) {
        cartService.inviteUserToCart(cartId, request.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cartId}")
    public ShoppingCartDTO getCartById(@PathVariable Long cartId) {
        return cartService.getCartById(cartId);
    }

    @GetMapping("/{cartId}/items")
    public List<ShoppingCartItemDTO> getItemsByCart(@PathVariable Long cartId) {
        return cartService.getItemsByCartId(cartId);
    }

    @PostMapping("/{cartId}/items")
    public ShoppingCartItemDTO addItemToCart(@PathVariable Long cartId, @RequestBody AddItemRequest request) {
        return cartService.addItemToCart(cartId, request.getProductItemId(), request.getQty(), request.getSize());
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long itemId) {
        cartService.removeItemFromCart(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public List<ShoppingCartDTO> mergeGuestCarts(@RequestBody MergeCartRequest request) {
        logger.info("/api/cart/merge called with userEmail: {} and guestCarts: {}", request.getUserEmail(), request.getGuestCarts());
        return cartService.mergeGuestCarts(request.getUserEmail(), request.getGuestCarts());
    }

    @Data
    public static class AddItemRequest {
        private Long productItemId;
        private int qty;
        private String size;
    }

    @Data
    public static class CreateCartRequest {
        private String name;
        private String createdBy;
    }

    @Data
    public static class InviteRequest {
        private String email;
    }
} 