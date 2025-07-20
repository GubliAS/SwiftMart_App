package com.example.shoppingcart.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "cart-sharing-service", url = "${cartsharing.service.url}")
public interface CartSharingClient {
    @GetMapping("/api/cart-sharing/share/{shareToken}")
    Object getShareByToken(@PathVariable("shareToken") String shareToken);
    
    @GetMapping("/api/cart-sharing/permissions")
    Object checkUserPermissions(@RequestParam("cartId") Long cartId, @RequestParam("userEmail") String userEmail);
} 