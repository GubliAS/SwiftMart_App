package com.example.orderstatushistory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.orderstatushistory.entity", "com.example.commonentities"})
public class OrderStatusHistoryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderStatusHistoryServiceApplication.class, args);
    }
} 