package com.example.product.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "promotion-service", url = "${promotion.service.url}")
public interface PromotionClient {
    @GetMapping("/api/promotions/{id}")
    Object getPromotionById(@PathVariable("id") Long id);
} 