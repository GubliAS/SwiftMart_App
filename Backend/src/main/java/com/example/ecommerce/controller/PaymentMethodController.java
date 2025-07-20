package com.example.ecommerce.controller;

import com.example.ecommerce.dto.PaymentTypeDTO;
import com.example.ecommerce.dto.UserPaymentMethodDTO;
import com.example.ecommerce.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @PostMapping
    public ResponseEntity<UserPaymentMethodDTO> addPaymentMethod(@RequestBody UserPaymentMethodDTO dto) {
        return ResponseEntity.ok(paymentMethodService.addPaymentMethod(dto));
    }

    @PutMapping
    public ResponseEntity<UserPaymentMethodDTO> updatePaymentMethod(@RequestBody UserPaymentMethodDTO dto) {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public List<UserPaymentMethodDTO> getPaymentMethodsForUser(@PathVariable Long userId) {
        return paymentMethodService.getPaymentMethodsForUser(userId);
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<UserPaymentMethodDTO> getDefaultPaymentMethodForUser(@PathVariable Long userId) {
        UserPaymentMethodDTO dto = paymentMethodService.getDefaultPaymentMethodForUser(userId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/types")
    public List<PaymentTypeDTO> getAllPaymentTypes() {
        return paymentMethodService.getAllPaymentTypes();
    }
} 