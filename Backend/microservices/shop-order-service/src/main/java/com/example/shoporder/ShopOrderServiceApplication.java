package com.example.shoporder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ShopOrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopOrderServiceApplication.class, args);
    }
} 