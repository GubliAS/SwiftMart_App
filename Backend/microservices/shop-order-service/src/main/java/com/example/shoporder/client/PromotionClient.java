package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "promotion-service", url = "${promotion.service.url}")
public interface PromotionClient {
    @GetMapping("/api/promotions")
    List<Object> getAllPromotions();

    @GetMapping("/api/promotions/category/{categoryId}")
    List<Object> getPromotionsByCategory(@PathVariable("categoryId") Long categoryId);
} 