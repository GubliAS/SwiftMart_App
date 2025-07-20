package com.example.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductVariantDTO {
    private Long id;
    private String color;
    private String image;
    private String size;
    private BigDecimal price;
} 