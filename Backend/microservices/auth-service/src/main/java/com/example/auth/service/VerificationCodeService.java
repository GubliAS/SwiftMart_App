package com.example.auth.service;

import com.example.auth.entity.VerificationCode;
import com.example.auth.repository.VerificationCodeRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VerificationCodeService {
    private final VerificationCodeRepository verificationCodeRepository;

    public VerificationCodeService(VerificationCodeRepository verificationCodeRepository) {
        this.verificationCodeRepository = verificationCodeRepository;
    }

    @Transactional
    public void saveCode(String email, String code) {
        System.out.println("🔄 Saving verification code for: " + email);
        try {
            verificationCodeRepository.deleteByEmail(email);
            System.out.println("✅ Deleted existing code for: " + email);
            
            VerificationCode entity = new VerificationCode();
            entity.setEmail(email);
            entity.setCode(code);
            entity.setCreatedAt(LocalDateTime.now());
            verificationCodeRepository.save(entity);
            System.out.println("✅ Saved new verification code for: " + email + " -> " + code);
        } catch (Exception e) {
            System.err.println("❌ Error saving verification code for " + email + ": " + e.getMessage());
            throw e;
        }
    }

    public Optional<VerificationCode> getCode(String email) {
        System.out.println("🔍 Looking up verification code for: " + email);
        Optional<VerificationCode> result = verificationCodeRepository.findByEmail(email);
        if (result.isPresent()) {
            System.out.println("✅ Found verification code for: " + email);
        } else {
            System.out.println("❌ No verification code found for: " + email);
        }
        return result;
    }

    @Transactional
    public void deleteCode(String email) {
        System.out.println("🗑️ Deleting verification code for: " + email);
        try {
            verificationCodeRepository.deleteByEmail(email);
            System.out.println("✅ Deleted verification code for: " + email);
        } catch (Exception e) {
            System.err.println("❌ Error deleting verification code for " + email + ": " + e.getMessage());
            throw e;
        }
    }
} 