package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role")
@Data
public class Role {
    @Id
    private Long id;
    private String name; // e.g., "BUYER", "SELLER", "ADMIN"
} 