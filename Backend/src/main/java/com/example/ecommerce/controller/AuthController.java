package com.example.ecommerce.controller;

import com.example.ecommerce.security.JwtUtil;
import com.example.ecommerce.service.SiteUserService;
import com.example.ecommerce.service.VerificationCodeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final SiteUserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final VerificationCodeService verificationCodeService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            String token = jwtUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Authentication failed");
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody EmailCheckRequest request) {
        try {
            boolean emailExists = userService.checkEmailExists(request.getEmail());
            return ResponseEntity.ok(new EmailCheckResponse(emailExists));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error checking email");
        }
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailCheckRequest request) {
        try {
            boolean emailExists = userService.checkEmailExists(request.getEmail());
            if (!emailExists) {
                return ResponseEntity.status(404).body("Email not found");
            }
            verificationCodeService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok("Verification code sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending verification code");
        }
    }

    @PostMapping("/send-registration-code")
    public ResponseEntity<?> sendRegistrationCode(@RequestBody EmailCheckRequest request) {
        try {
            boolean emailExists = userService.checkEmailExists(request.getEmail());
            if (emailExists) {
                return ResponseEntity.status(409).body("Email already exists");
            }
            verificationCodeService.sendRegistrationCode(request.getEmail());
            return ResponseEntity.ok("Verification code sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending verification code");
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        try {
            boolean isValid = verificationCodeService.verifyCodeWithoutConsuming(request.getEmail(), request.getCode());
            if (isValid) {
                return ResponseEntity.ok("Code verified successfully");
            } else {
                return ResponseEntity.status(400).body("Invalid or expired code");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying code");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            // First verify the code without consuming it
            boolean isValid = verificationCodeService.verifyCodeWithoutConsuming(request.getEmail(), request.getCode());
            if (!isValid) {
                return ResponseEntity.status(400).body("Invalid or expired code");
            }
            // Update the password
            userService.resetPassword(request.getEmail(), request.getNewPassword());
            // Now consume the code after successful password reset
            verificationCodeService.consumeCode(request.getEmail());
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error resetting password");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            boolean success = userService.changePassword(userEmail, request.getCurrentPassword(), request.getNewPassword());
            
            if (success) {
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.status(400).body("Current password is incorrect");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error changing password");
        }
    }

    @Data
    public static class AuthRequest {
        private String email;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private final String token;
    }

    @Data
    public static class EmailCheckRequest {
        private String email;
    }

    @Data
    public static class EmailCheckResponse {
        private final boolean exists;
    }

    @Data
    public static class VerifyCodeRequest {
        private String email;
        private String code;
    }

    @Data
    public static class ResetPasswordRequest {
        private String email;
        private String code;
        private String newPassword;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
} 