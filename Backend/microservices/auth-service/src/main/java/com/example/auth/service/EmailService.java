package com.example.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swiftmart980@gmail.com");
        message.setTo(toEmail);
        message.setSubject("SwiftMart - Verification Code");
        message.setText("Your verification code is: " + code + "\n\nThis code will expire after use.\n\nBest regards,\nSwiftMart Team");
        
        try {
            mailSender.send(message);
            System.out.println("Verification email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            // Fallback to console log if email fails
            System.out.println("Verification code for " + toEmail + ": " + code);
        }
    }
    
    public void sendRegistrationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swiftmart980@gmail.com");
        message.setTo(toEmail);
        message.setSubject("SwiftMart - Registration Code");
        message.setText("Your registration code is: " + code + "\n\nUse this code to complete your registration.\n\nBest regards,\nSwiftMart Team");
        
        try {
            mailSender.send(message);
            System.out.println("Registration email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            // Fallback to console log if email fails
            System.out.println("Registration code for " + toEmail + ": " + code);
        }
    }
} 