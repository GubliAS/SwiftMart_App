package com.example.product.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.util.List;
import com.example.product.entity.ShippingOption;
import com.example.product.entity.ProductVariant;
import com.example.commonentities.SiteUser;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private SiteUser seller;

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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ShippingOption> shippingOptions;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
} 