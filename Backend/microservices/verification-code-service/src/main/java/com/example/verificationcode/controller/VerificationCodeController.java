package com.example.verificationcode.controller;

import com.example.verificationcode.service.VerificationCodeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VerificationCodeController {
    private final VerificationCodeService verificationCodeService;

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailRequest request) {
        verificationCodeService.sendVerificationCode(request.getEmail());
        return ResponseEntity.ok("Verification code sent successfully");
    }

    @PostMapping("/send-registration-code")
    public ResponseEntity<?> sendRegistrationCode(@RequestBody EmailRequest request) {
        verificationCodeService.sendRegistrationCode(request.getEmail());
        return ResponseEntity.ok("Registration code sent successfully");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        boolean isValid = verificationCodeService.verifyCodeWithoutConsuming(request.getEmail(), request.getCode());
        if (isValid) {
            return ResponseEntity.ok("Code verified successfully");
        } else {
            return ResponseEntity.status(400).body(new ErrorResponse("Invalid or expired code"));
        }
    }

    @PostMapping("/consume-code")
    public ResponseEntity<?> consumeCode(@RequestBody EmailRequest request) {
        verificationCodeService.consumeCode(request.getEmail());
        return ResponseEntity.ok("Code consumed successfully");
    }

    @Data
    public static class EmailRequest {
        private String email;
    }

    @Data
    public static class VerifyCodeRequest {
        private String email;
        private String code;
    }

    @Data
    public static class ErrorResponse {
        private final String error;
    }
} 