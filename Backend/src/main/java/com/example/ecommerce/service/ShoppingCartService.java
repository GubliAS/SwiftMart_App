package com.example.ecommerce.service;

import com.example.ecommerce.dto.ShoppingCartDTO;
import com.example.ecommerce.dto.ShoppingCartItemDTO;
import com.example.ecommerce.entity.ShoppingCart;
import com.example.ecommerce.entity.ShoppingCartItem;
import com.example.ecommerce.entity.ProductItem;
import com.example.ecommerce.mapper.ShoppingCartItemMapper;
import com.example.ecommerce.mapper.ShoppingCartMapper;
import com.example.ecommerce.repository.ShoppingCartItemRepository;
import com.example.ecommerce.repository.ShoppingCartRepository;
import com.example.ecommerce.repository.SiteUserRepository;
import com.example.ecommerce.repository.ProductItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {
    private final ShoppingCartRepository cartRepository;
    private final ShoppingCartItemRepository itemRepository;
    private final SiteUserRepository userRepository;
    private final ProductItemRepository productItemRepository;
    private final ShoppingCartMapper cartMapper;
    private final ShoppingCartItemMapper itemMapper;

    public ShoppingCartDTO getCartByUserId(Long userId) {
        ShoppingCart cart = cartRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return cartMapper.toDto(cart);
    }

    public List<ShoppingCartItemDTO> getItemsByCartId(Long cartId) {
        return itemRepository.findAll().stream()
                .filter(i -> i.getCart().getId().equals(cartId))
                .map(itemMapper::toDto)
                .collect(Collectors.toList());
    }

    public ShoppingCartItemDTO addItemToCart(Long cartId, Long productItemId, int qty) {
        ShoppingCart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        ProductItem productItem = productItemRepository.findById(productItemId)
                .orElseThrow(() -> new RuntimeException("Product item not found"));
        ShoppingCartItem item = new ShoppingCartItem();
        item.setCart(cart);
        item.setProductItem(productItem);
        item.setQty(qty);
        return itemMapper.toDto(itemRepository.save(item));
    }

    public void removeItemFromCart(Long itemId) {
        itemRepository.deleteById(itemId);
    }
} 