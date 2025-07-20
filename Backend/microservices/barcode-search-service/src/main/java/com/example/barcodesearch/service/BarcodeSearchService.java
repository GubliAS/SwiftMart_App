package com.example.barcodesearch.service;

import com.example.barcodesearch.client.ProductClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BarcodeSearchService {
    private final ProductClient productClient;

    public Object searchByBarcode(String barcode) {
        try {
            log.info("Searching for product with barcode: {}", barcode);
            
            // Call product service to get product by barcode
            Object product = productClient.getProductByBarcode(barcode);
            
            if (product != null) {
                log.info("Product found for barcode: {}", barcode);
                return product;
            } else {
                log.warn("No product found for barcode: {}", barcode);
                return null;
            }
        } catch (Exception e) {
            log.error("Error searching barcode: {}", barcode, e);
            throw new RuntimeException("Failed to search barcode: " + e.getMessage());
        }
    }
} 