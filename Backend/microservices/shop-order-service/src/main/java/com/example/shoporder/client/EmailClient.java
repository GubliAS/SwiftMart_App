package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.Data;

@FeignClient(name = "email-service", url = "${email.service.url}")
public interface EmailClient {
    @PostMapping("/api/email/send")
    void sendEmail(@RequestBody EmailRequest request);

    @Data
    class EmailRequest {
        private String to;
        private String subject;
        private String text;
    }
} 