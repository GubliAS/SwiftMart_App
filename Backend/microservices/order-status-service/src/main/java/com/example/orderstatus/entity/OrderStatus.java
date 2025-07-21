package com.example.orderstatus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_status")
@Data
public class OrderStatus {
    @Id
    private Long id;
    private String status;
} 