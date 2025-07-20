package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payment_type")
@Data
public class PaymentType {
    @Id
    private Long id;
    private String value;
} 