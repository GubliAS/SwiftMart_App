package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "shipping-method-service", url = "${shippingmethod.service.url}")
public interface ShippingMethodClient {
    @GetMapping("/api/shipping-methods")
    List<Object> getAllShippingMethods();
} 