package com.example.product.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Entity
@Table(name = "product")
@Data
@Document(indexName = "products")
public class Product {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String productImage;

    @Field(type = FieldType.Keyword)
    private String barcode;

    private java.math.BigDecimal price;
    private java.math.BigDecimal originalPrice;
    private java.math.BigDecimal discount;
    private Double rating;
    private String condition;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
} 