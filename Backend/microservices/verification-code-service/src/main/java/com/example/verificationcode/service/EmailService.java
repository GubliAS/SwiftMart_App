package com.example.verificationcode.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendEmail(String to, String subject, String text) {
        System.out.println("=== MOCK EMAIL SENT ===");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + text);
        System.out.println("=== END MOCK EMAIL ===");
    }
} 