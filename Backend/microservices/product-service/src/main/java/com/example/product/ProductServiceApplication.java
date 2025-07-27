package com.example.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.product.entity", "com.example.commonentities"})
@EnableFeignClients
@EnableJpaRepositories(basePackages = "com.example.product.repository.jpa")
@EnableElasticsearchRepositories(basePackages = "com.example.product.repository.elasticsearch")
public class ProductServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
} 