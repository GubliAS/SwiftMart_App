package com.example.siteuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SiteUserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SiteUserServiceApplication.class, args);
    }
} 