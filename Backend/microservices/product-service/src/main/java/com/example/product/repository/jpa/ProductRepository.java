package com.example.product.repository.jpa;

import com.example.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN ProductItem pi ON pi.product = p " +
           "WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:minPrice IS NULL OR pi.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR pi.price <= :maxPrice)")
    List<Product> searchProducts(
        @Param("categoryId") Long categoryId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shippingOptions WHERE p.id = :id")
    Optional<Product> findByIdWithShippingOptions(@Param("id") Long id);
} 