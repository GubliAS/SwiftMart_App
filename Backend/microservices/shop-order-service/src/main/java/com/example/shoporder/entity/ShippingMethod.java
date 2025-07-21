package com.example.shoporder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ShippingMethod {
    @Id
    private Long id;
} 