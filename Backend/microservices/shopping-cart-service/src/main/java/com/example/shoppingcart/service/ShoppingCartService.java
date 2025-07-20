package com.example.shoppingcart.service;

import com.example.shoppingcart.client.SiteUserClient;
import com.example.shoppingcart.dto.ShoppingCartDTO;
import com.example.shoppingcart.dto.ShoppingCartItemDTO;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class ShoppingCartService {
    private final SiteUserClient siteUserClient;

    public ShoppingCartService(SiteUserClient siteUserClient) {
        this.siteUserClient = siteUserClient;
    }

    public Object getUserById(Long userId) {
        return siteUserClient.getUserById(userId);
    }

    public ShoppingCartDTO getCartByUserId(Long userId) {
        // TODO: Implement logic
        return new ShoppingCartDTO();
    }

    public List<ShoppingCartItemDTO> getItemsByCartId(Long cartId) {
        // TODO: Implement logic
        return Collections.emptyList();
    }

    public ShoppingCartItemDTO addItemToCart(Long cartId, Long productItemId, int qty) {
        // TODO: Implement logic
        return new ShoppingCartItemDTO();
    }

    public void removeItemFromCart(Long itemId) {
        // TODO: Implement logic
    }
} 