package com.example.shoporder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
public class ProductItem {
    @Id
    private Long id;
    private BigDecimal price;
    private int qtyInStock;
} 