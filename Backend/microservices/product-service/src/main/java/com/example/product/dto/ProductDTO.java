package com.example.product.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class ProductDTO {
    @NotNull
    private Long id;

    @NotNull
    private Long categoryId;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    private String productImage;
    private java.math.BigDecimal price;
    private java.math.BigDecimal originalPrice;
    private java.math.BigDecimal discount;
    private Double rating;
    private String condition;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private java.util.List<ProductVariantDTO> variants;
    private java.util.List<ShippingOptionDTO> shippingOptions;
} 