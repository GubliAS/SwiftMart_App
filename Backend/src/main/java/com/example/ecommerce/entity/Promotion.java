package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promotion")
@Data
public class Promotion {
    @Id
    private Long id;
    private String name;
    private String description;
    @Column(name = "discount_rate")
    private BigDecimal discountRate;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
} 