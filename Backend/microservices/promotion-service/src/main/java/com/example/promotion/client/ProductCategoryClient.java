package com.example.promotion.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.promotion.entity.ProductCategory;

@FeignClient(name = "product-service", url = "${product.service.url}")
public interface ProductCategoryClient {
    @GetMapping("/api/categories/{id}")
    ProductCategory getCategoryById(@PathVariable("id") Long id);
} 