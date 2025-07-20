package com.example.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ShippingOptionDTO {
    private Long id;
    private String type;
    private String duration;
    private BigDecimal price;
} 