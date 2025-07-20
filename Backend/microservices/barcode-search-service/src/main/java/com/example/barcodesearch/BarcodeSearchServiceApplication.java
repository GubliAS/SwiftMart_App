package com.example.barcodesearch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BarcodeSearchServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BarcodeSearchServiceApplication.class, args);
    }
} 