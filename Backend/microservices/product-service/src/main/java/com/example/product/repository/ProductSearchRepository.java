package com.example.product.repository;

import com.example.product.entity.Product;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<Product, Long> {
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByDescriptionContainingIgnoreCase(String description);
    
    Optional<Product> findByBarcode(String barcode);
    
    List<Product> findByCategoryCategoryNameContainingIgnoreCase(String categoryName);
    
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
} 