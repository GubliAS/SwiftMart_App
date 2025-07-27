package com.example.auth.controller;

import com.example.auth.security.JwtUtil;
import com.example.auth.repository.SiteUserRepository;
import com.example.auth.repository.RoleRepository;
import com.example.auth.service.EmailService;
import com.example.commonentities.SiteUser;
import com.example.commonentities.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.concurrent.ConcurrentHashMap;
import com.example.auth.entity.VerificationCode;
import com.example.auth.repository.VerificationCodeRepository;
import java.time.LocalDateTime;
import com.example.auth.service.VerificationCodeService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SiteUserRepository siteUserRepository;
    private final RoleRepository roleRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final VerificationCodeService verificationCodeService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return siteUserRepository.findByEmailAddress(request.getEmail())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .<ResponseEntity<?>>map(user -> {
                    String role = user.getRoles().iterator().next().getName();
                    String token = jwtUtil.generateTokenWithRole(user.getEmailAddress(), role);
                    return ResponseEntity.ok(new AuthResponse(token));
                })
                .orElse(ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials")));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody TokenRequest request) {
        try {
            String username = jwtUtil.extractUsername(request.getToken());
            boolean valid = jwtUtil.validateToken(request.getToken(), username);
            if (valid) {
                return ResponseEntity.ok("Token is valid for user: " + username);
            } else {
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (siteUserRepository.findByEmailAddress(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email already registered"));
        }
        
        SiteUser user = new SiteUser();
        user.setEmailAddress(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        
        // Assign role based on registration type
        Set<Role> roles = new HashSet<>();
        if ("SELLER".equals(request.getRole())) {
            // Add seller-specific fields
            user.setStoreName(request.getStoreName());
            user.setIdCardType(request.getIdCardType());
            user.setIdCardCountry(request.getIdCardCountry());
            user.setIdCardNumber(request.getIdCardNumber());
            user.setIsVerified(false);
            user.setVerificationStatus("PENDING");
            
            // Assign SELLER role
            Role sellerRole = roleRepository.findByName("SELLER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("SELLER");
                    return roleRepository.save(newRole);
                });
            roles.add(sellerRole);
            
            System.out.println("=== SELLER REGISTRATION WITH ID VERIFICATION ===");
            System.out.println("Store Name: " + request.getStoreName());
            System.out.println("ID Card Type: " + request.getIdCardType());
            System.out.println("ID Card Country: " + request.getIdCardCountry());
            System.out.println("ID Card Number: " + request.getIdCardNumber());
            System.out.println("Role Assigned: SELLER");
            System.out.println("=== VALIDATION STATUS ===");
            System.out.println("✅ Frontend validation passed (format check)");
            System.out.println("⚠️  Backend validation: Basic format only");
            System.out.println("ℹ️  Note: Real verification requires government API integration");
            System.out.println("=== NEXT STEPS ===");
            System.out.println("1. Admin review of ID verification data");
            System.out.println("2. Manual verification or third-party service integration");
            System.out.println("3. Account approval/rejection process");
            System.out.println("================================================");
        } else {
            // Assign BUYER role (default)
            Role buyerRole = roleRepository.findByName("BUYER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("BUYER");
                    return roleRepository.save(newRole);
                });
            roles.add(buyerRole);
            
            System.out.println("=== BUYER REGISTRATION ===");
            System.out.println("Role Assigned: BUYER");
            System.out.println("================================================");
        }
        
        user.setRoles(roles);
        siteUserRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody VerificationCodeRequest request) {
        Optional<SiteUser> user = siteUserRepository.findByEmailAddress(request.getEmail());
        if (user.isPresent()) {
            String code = String.format("%04d", (int)(Math.random() * 10000));
            try {
                verificationCodeService.saveCode(request.getEmail(), code);
                emailService.sendVerificationCode(request.getEmail(), code);
                return ResponseEntity.ok(new MessageResponse("Verification code sent"));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(new ErrorResponse("Internal server error: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
    }

    @PostMapping("/send-registration-code")
    public ResponseEntity<?> sendRegistrationCode(@RequestBody VerificationCodeRequest request) {
        System.out.println("📧 [SEND-REGISTRATION-CODE] Request received for email: " + request.getEmail());
        
        if (siteUserRepository.findByEmailAddress(request.getEmail()).isPresent()) {
            System.out.println("❌ [SEND-REGISTRATION-CODE] Email already registered: " + request.getEmail());
            return ResponseEntity.badRequest().body(new ErrorResponse("Email already registered"));
        }
        
        String code = String.format("%04d", (int)(Math.random() * 10000));
        System.out.println("🔢 [SEND-REGISTRATION-CODE] Generated code: " + code + " for email: " + request.getEmail());
        
        try {
            System.out.println("💾 [SEND-REGISTRATION-CODE] Saving code to database...");
            verificationCodeService.saveCode(request.getEmail(), code);
            
            System.out.println("📤 [SEND-REGISTRATION-CODE] Sending email...");
            emailService.sendRegistrationCode(request.getEmail(), code);
            
            System.out.println("✅ [SEND-REGISTRATION-CODE] Successfully sent registration code to: " + request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Registration code sent"));
        } catch (Exception e) {
            System.err.println("❌ [SEND-REGISTRATION-CODE] Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ErrorResponse("Internal server error: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        System.out.println("🔍 [VERIFY-CODE] Request received for email: " + request.getEmail() + " with code: " + request.getCode());
        
        Optional<VerificationCode> codeOpt = verificationCodeService.getCode(request.getEmail())
            .filter(vc -> vc.getCode().equals(request.getCode()));
        
        if (codeOpt.isPresent()) {
            System.out.println("✅ [VERIFY-CODE] Code verified successfully for: " + request.getEmail());
            verificationCodeService.deleteCode(request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Code verified successfully"));
        } else {
            System.out.println("❌ [VERIFY-CODE] Invalid code for: " + request.getEmail());
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid verification code"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        return siteUserRepository.findByEmailAddress(request.getEmail())
                .<ResponseEntity<?>>map(user -> {
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    siteUserRepository.save(user);
                    return ResponseEntity.ok("Password reset successfully");
                })
                .orElse(ResponseEntity.badRequest().body(new ErrorResponse("User not found")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        Optional<SiteUser> userOpt = siteUserRepository.findByEmailAddress(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
        SiteUser user = userOpt.get();
        String role = user.getRoles().iterator().next().getName();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmailAddress());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("phoneNumber", user.getPhoneNumber());
        profile.put("role", role);
        profile.put("storeName", user.getStoreName());
        profile.put("idCardType", user.getIdCardType());
        profile.put("idCardCountry", user.getIdCardCountry());
        profile.put("idCardNumber", user.getIdCardNumber());
        profile.put("verificationStatus", user.getVerificationStatus());
        if (user.getProfilePhotoUrl() != null) {
            Map<String, String> photoMap = new HashMap<>();
            photoMap.put("uri", user.getProfilePhotoUrl());
            profile.put("photo", photoMap);
        } else {
            profile.put("photo", null);
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader, @RequestBody UpdateProfileRequest req) {
        System.out.println("[PUT /me] Incoming update: firstName=" + req.getFirstName() + ", lastName=" + req.getLastName() + ", phoneNumber=" + req.getPhoneNumber() + ", photoUrl=" + req.getPhotoUrl());
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        Optional<SiteUser> userOpt = siteUserRepository.findByEmailAddress(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
        SiteUser user = userOpt.get();
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getPhotoUrl() != null) user.setProfilePhotoUrl(req.getPhotoUrl());
        siteUserRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String authHeader, @RequestBody ChangePasswordRequest req) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        Optional<SiteUser> userOpt = siteUserRepository.findByEmailAddress(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
        SiteUser user = userOpt.get();
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body(new ErrorResponse("Current password is incorrect"));
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        siteUserRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    @DeleteMapping("/user")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String authHeader) {
        System.out.println("[DELETE /user] Authorization header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[DELETE /user] Missing or invalid Authorization header");
            return ResponseEntity.status(401).body(new ErrorResponse("Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtUtil.extractUsername(token);
            System.out.println("[DELETE /user] Extracted email: " + email);
        } catch (Exception e) {
            System.out.println("[DELETE /user] Failed to extract email from token: " + e.getMessage());
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid token"));
        }
        Optional<SiteUser> userOpt = siteUserRepository.findByEmailAddress(email);
        if (userOpt.isEmpty()) {
            System.out.println("[DELETE /user] User not found for email: " + email);
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
        siteUserRepository.delete(userOpt.get());
        System.out.println("[DELETE /user] User deleted: " + email);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("[TEST] /api/auth/test endpoint hit");
        return "test ok";
    }

    @Data
    public static class AuthRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private String storeName;
        private String idCardType;
        private String idCardCountry;
        private String idCardNumber;
        private String role;
    }

    @Data
    public static class AuthResponse {
        private final String token;
    }

    @Data
    public static class TokenRequest {
        private String token;
    }

    @Data
    public static class PasswordResetRequest {
        private String email;
        private String newPassword;
    }

    @Data
    public static class VerificationCodeRequest {
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

    @Data
    public static class MessageResponse {
        private final String message;
    }

    @Data
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private String photoUrl;
    }
    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
} 