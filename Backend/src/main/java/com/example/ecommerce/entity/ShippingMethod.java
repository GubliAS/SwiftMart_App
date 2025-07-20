package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_method")
@Data
public class ShippingMethod {
    @Id
    private Long id;
    private String name;
    private BigDecimal price;
} 