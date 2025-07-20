package com.example.cartsharing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CartSharingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CartSharingServiceApplication.class, args);
    }
} 