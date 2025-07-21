package com.example.barcodesearch.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "${product.service.url}")
public interface ProductClient {
    @GetMapping("/api/products/barcode/{barcode}")
    Object getProductByBarcode(@PathVariable("barcode") String barcode);
} 