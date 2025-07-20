package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerificationCodeService {
    private final Map<String, CodeInfo> verificationCodes = new ConcurrentHashMap<>();
    private final EmailService emailService;
    private final Random random = new Random();
    
    // Temporary: Set to true for testing without email setup
    private final boolean MOCK_MODE = false;

    public VerificationCodeService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendVerificationCode(String email) {
        String code = generateCode();
        String subject = "SwiftMart - Password Reset Code";
        String message = String.format(
            "Your password reset code is: %s\n\n" +
            "This code will expire in 10 minutes.\n" +
            "If you didn't request this code, please ignore this email.",
            code
        );

        // Store the code with expiration time (10 minutes)
        verificationCodes.put(email, new CodeInfo(code, LocalDateTime.now().plusMinutes(10)));

        // Send the email (or mock it for testing)
        if (MOCK_MODE) {
            System.out.println("=== MOCK EMAIL SENT ===");
            System.out.println("To: " + email);
            System.out.println("Subject: " + subject);
            System.out.println("Message: " + message);
            System.out.println("=== END MOCK EMAIL ===");
        } else {
            emailService.sendEmail(email, subject, message);
        }
    }

    public void sendRegistrationCode(String email) {
        String code = generateCode();
        String subject = "SwiftMart - Registration Verification Code";
        String message = String.format(
            "Your registration verification code is: %s\n\n" +
            "This code will expire in 10 minutes.\n" +
            "If you didn't request this code, please ignore this email.",
            code
        );

        // Store the code with expiration time (10 minutes)
        verificationCodes.put(email, new CodeInfo(code, LocalDateTime.now().plusMinutes(10)));

        // Send the email (or mock it for testing)
        if (MOCK_MODE) {
            System.out.println("=== MOCK EMAIL SENT ===");
            System.out.println("To: " + email);
            System.out.println("Subject: " + subject);
            System.out.println("Message: " + message);
            System.out.println("=== END MOCK EMAIL ===");
        } else {
            emailService.sendEmail(email, subject, message);
        }
    }

    public boolean verifyCode(String email, String code) {
        CodeInfo storedInfo = verificationCodes.get(email);
        if (storedInfo == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(storedInfo.expirationTime)) {
            verificationCodes.remove(email);
            return false;
        }
        if (storedInfo.code.equals(code)) {
            verificationCodes.remove(email);
            return true;
        }
        return false;
    }

    public boolean verifyCodeWithoutConsuming(String email, String code) {
        CodeInfo storedInfo = verificationCodes.get(email);
        if (storedInfo == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(storedInfo.expirationTime)) {
            verificationCodes.remove(email);
            return false;
        }
        return storedInfo.code.equals(code);
    }

    public void consumeCode(String email) {
        verificationCodes.remove(email);
    }

    private String generateCode() {
        if (MOCK_MODE) {
            // For testing, always return "1234"
            return "1234";
        }
        return String.format("%04d", random.nextInt(10000));
    }

    private static class CodeInfo {
        final String code;
        final LocalDateTime expirationTime;

        CodeInfo(String code, LocalDateTime expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }
    }
} 