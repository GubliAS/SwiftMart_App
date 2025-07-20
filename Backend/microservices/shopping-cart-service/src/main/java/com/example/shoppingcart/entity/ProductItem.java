package com.example.shoppingcart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ProductItem {
    @Id
    private Long id;
} 