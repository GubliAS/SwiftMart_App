package com.example.shoppingcart.service;

import com.example.shoppingcart.client.SiteUserClient;
import com.example.shoppingcart.dto.ShoppingCartDTO;
import com.example.shoppingcart.dto.ShoppingCartItemDTO;
import com.example.shoppingcart.entity.ProductItem;
import com.example.shoppingcart.entity.ShoppingCart;
import com.example.shoppingcart.entity.ShoppingCartItem;
import com.example.shoppingcart.repository.ShoppingCartItemRepository;
import com.example.shoppingcart.repository.ShoppingCartRepository;
import com.example.shoppingcart.repository.ProductItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.shoppingcart.dto.MergeCartRequest;

@Service
public class ShoppingCartService {

    private final SiteUserClient siteUserClient;
    private final ShoppingCartRepository cartRepository;
    private final ShoppingCartItemRepository itemRepository;
    private final ProductItemRepository productItemRepository;
    private static final Logger logger = LoggerFactory.getLogger(ShoppingCartService.class);

    public ShoppingCartService(SiteUserClient siteUserClient, ShoppingCartRepository cartRepository, ShoppingCartItemRepository itemRepository, ProductItemRepository productItemRepository) {
        this.siteUserClient = siteUserClient;
        this.cartRepository = cartRepository;
        this.itemRepository = itemRepository;
        this.productItemRepository = productItemRepository;
    }

    public Object getUserById(Long userId) {
        return siteUserClient.getUserById(userId);
    }

    @Transactional
    public ShoppingCartDTO createCart(String name, String createdBy) {
        ShoppingCart cart = new ShoppingCart();
        cart.setName(name);
        cart.setCreatedBy(createdBy);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setInvitedEmails(Collections.emptyList());
        ShoppingCart saved = cartRepository.save(cart);
        return toDTO(saved);
    }

    public List<ShoppingCartDTO> getAllCartsForUser(String userEmail) {
        List<ShoppingCart> owned = cartRepository.findAll().stream()
                .filter(c -> userEmail.equals(c.getCreatedBy()))
                .collect(Collectors.toList());
        List<ShoppingCart> invited = cartRepository.findAll().stream()
                .filter(c -> c.getInvitedEmails() != null && c.getInvitedEmails().contains(userEmail))
                .collect(Collectors.toList());
        owned.addAll(invited);
        return owned.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ShoppingCartDTO> getAllCarts() {
        return cartRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void inviteUserToCart(Long cartId, String email) {
        ShoppingCart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<String> invited = cart.getInvitedEmails();
        if (!invited.contains(email)) {
            invited.add(email);
            cart.setInvitedEmails(invited);
            cartRepository.save(cart);
        }
    }

    @Transactional
    public ShoppingCartDTO getCartById(Long cartId) {
        ShoppingCart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<ShoppingCartItem> items = itemRepository.findByCartId(cart.getId());
        ShoppingCartDTO dto = toDTO(cart);
        dto.setItems(items.stream().map(this::toDTO).collect(Collectors.toList()));
        return dto;
    }

    public List<ShoppingCartItemDTO> getItemsByCartId(Long cartId) {
        List<ShoppingCartItem> items = itemRepository.findByCartId(cartId);
        return items.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ShoppingCartItemDTO addItemToCart(Long cartId, Long productItemId, int qty, String size) {
        ShoppingCart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        // Check if product item exists
        ProductItem productItem = productItemRepository.findById(productItemId)
                .orElseThrow(() -> new RuntimeException("Product item not found: " + productItemId));
        // Check if item already exists
        List<ShoppingCartItem> items = itemRepository.findByCartId(cartId);
        for (ShoppingCartItem item : items) {
            if (item.getProductItem().getId().equals(productItemId)
                    && ((item.getSize() == null && size == null) || (item.getSize() != null && item.getSize().equals(size)))) {
                item.setQuantity(qty); // Set to the new quantity, not add
                itemRepository.save(item);
                return toDTO(item);
            }
        }
        // Otherwise, add new item
        ShoppingCartItem newItem = new ShoppingCartItem();
        newItem.setCart(cart);
        newItem.setProductItem(productItem);
        newItem.setQuantity(qty);
        newItem.setSize(size);
        itemRepository.save(newItem);
        return toDTO(newItem);
    }

    @Transactional
    public void removeItemFromCart(Long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Transactional
    public void deleteCart(Long cartId) {
        // Delete all items in the cart first
        itemRepository.deleteAll(itemRepository.findByCartId(cartId));
        // Then delete the cart
        cartRepository.deleteById(cartId);
    }

    @Transactional
    public List<ShoppingCartDTO> mergeGuestCarts(String userEmail, List<MergeCartRequest.GuestCartDTO> guestCarts) {
        logger.info("mergeGuestCarts called for userEmail: {} with guestCarts: {}", userEmail, guestCarts);
        if (guestCarts == null || guestCarts.isEmpty()) {
            logger.info("No guest carts to merge for userEmail: {}", userEmail);
            return getAllCartsForUser(userEmail);
        }
        // Find or create 'My Cart' for this user
        ShoppingCart myCart = cartRepository.findAll().stream()
            .filter(c -> userEmail.equals(c.getCreatedBy()) && "My Cart".equals(c.getName()))
            .findFirst()
            .orElseGet(() -> {
                logger.info("Creating new 'My Cart' for userEmail: {}", userEmail);
                ShoppingCart newCart = new ShoppingCart();
                newCart.setName("My Cart");
                newCart.setCreatedBy(userEmail);
                newCart.setCreatedAt(java.time.LocalDateTime.now());
                newCart.setUpdatedAt(java.time.LocalDateTime.now());
                newCart.setInvitedEmails(java.util.Collections.emptyList());
                return cartRepository.save(newCart);
            });
        // Build a map of (productItemId + size) -> ShoppingCartItem for merging
        java.util.List<ShoppingCartItem> existingItems = itemRepository.findByCartId(myCart.getId());
        java.util.Map<String, ShoppingCartItem> mergedMap = new java.util.HashMap<>();
        for (ShoppingCartItem item : existingItems) {
            String key = item.getProductItem().getId() + "__" + (item.getSize() == null ? "" : item.getSize());
            mergedMap.put(key, item);
        }
        // Merge guest items
        for (MergeCartRequest.GuestCartDTO guestCart : guestCarts) {
            if (guestCart.getItems() == null) continue;
            for (MergeCartRequest.GuestCartItemDTO guestItem : guestCart.getItems()) {
                String key = guestItem.getProductItemId() + "__" + (guestItem.getSize() == null ? "" : guestItem.getSize());
                logger.info("Merging item for userEmail {}: productItemId={}, size={}, quantity={}", userEmail, guestItem.getProductItemId(), guestItem.getSize(), guestItem.getQuantity());
                ShoppingCartItem existing = mergedMap.get(key);
                if (existing != null) {
                    existing.setQuantity(existing.getQuantity() + guestItem.getQuantity());
                    itemRepository.save(existing);
                } else {
                    ProductItem productItem = productItemRepository.findById(guestItem.getProductItemId())
                        .orElseThrow(() -> new RuntimeException("Product item not found: " + guestItem.getProductItemId()));
                    ShoppingCartItem newItem = new ShoppingCartItem();
                    newItem.setCart(myCart);
                    newItem.setProductItem(productItem);
                    newItem.setQuantity(guestItem.getQuantity());
                    newItem.setSize(guestItem.getSize());
                    itemRepository.save(newItem);
                    mergedMap.put(key, newItem);
                }
            }
        }
        myCart.setUpdatedAt(java.time.LocalDateTime.now());
        cartRepository.save(myCart);
        logger.info("Merge complete for userEmail: {}. Returning all carts.", userEmail);
        return getAllCartsForUser(userEmail);
    }

    private ShoppingCartDTO toDTO(ShoppingCart cart) {
        ShoppingCartDTO dto = new ShoppingCartDTO();
        dto.setId(cart.getId());
        dto.setName(cart.getName());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());
        dto.setUserId(null); // Not used in multi-cart
        // Fetch items for this cart
        List<ShoppingCartItem> items = itemRepository.findByCartId(cart.getId());
        dto.setItems(items.stream().map(this::toDTO).collect(Collectors.toList()));
        return dto;
    }

    private ShoppingCartItemDTO toDTO(ShoppingCartItem item) {
        ShoppingCartItemDTO dto = new ShoppingCartItemDTO();
        dto.setId(item.getId());
        dto.setCartId(item.getCart().getId());
        dto.setProductItemId(item.getProductItem().getId());
        dto.setQuantity(item.getQuantity());
        dto.setSize(item.getSize());
        return dto;
    }
}
