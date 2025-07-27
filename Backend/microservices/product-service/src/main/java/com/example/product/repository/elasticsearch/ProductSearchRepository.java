package com.example.product.repository.elasticsearch;

import com.example.product.entity.Product;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;
import java.util.Optional;

public interface ProductSearchRepository extends ElasticsearchRepository<Product, Long> {
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByCategoryCategoryNameContainingIgnoreCase(String categoryName);
} 