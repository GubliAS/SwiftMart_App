package com.example.paymentmethod;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.paymentmethod.entity", "com.example.commonentities"})
@EnableFeignClients
public class PaymentMethodServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMethodServiceApplication.class, args);
    }
} 