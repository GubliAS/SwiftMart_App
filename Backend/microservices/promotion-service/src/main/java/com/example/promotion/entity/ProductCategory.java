package com.example.promotion.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ProductCategory {
    @Id
    private Long id;
} 