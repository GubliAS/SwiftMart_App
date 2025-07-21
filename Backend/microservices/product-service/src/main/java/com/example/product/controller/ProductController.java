package com.example.product.controller;

import com.example.product.dto.ProductDTO;
import com.example.product.service.ProductService;
import com.example.product.service.ProductSearchService;
import com.example.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ProductSearchService productSearchService;
    private final ProductMapper productMapper;

    @GetMapping
    public Page<ProductDTO> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getAllProducts(pageable);
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public ProductDTO createProduct(@RequestBody @Valid ProductDTO dto) {
        return productService.createProduct(dto);
    }

    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody @Valid ProductDTO dto) {
        return productService.updateProduct(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<ProductDTO> searchProducts(@RequestParam String query) {
        return productSearchService.searchProducts(query).stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/fuzzy")
    public List<ProductDTO> fuzzySearch(@RequestParam String query) {
        return productSearchService.fuzzySearch(query).stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/autocomplete")
    public List<String> getAutocompleteSuggestions(@RequestParam String prefix) {
        return productSearchService.getAutocompleteSuggestions(prefix);
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ProductDTO> getProductByBarcode(@PathVariable String barcode) {
        return productSearchService.findByBarcode(barcode)
                .map(productMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryName}")
    public List<ProductDTO> getProductsByCategory(@PathVariable String categoryName) {
        return productSearchService.searchByCategory(categoryName).stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
} 