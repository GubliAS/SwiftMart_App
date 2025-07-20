package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ShippingMethodDTO;
import com.example.ecommerce.service.ShippingMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping-methods")
@RequiredArgsConstructor
public class ShippingMethodController {
    private final ShippingMethodService shippingMethodService;

    @PostMapping
    public ResponseEntity<ShippingMethodDTO> addShippingMethod(@RequestBody ShippingMethodDTO dto) {
        return ResponseEntity.ok(shippingMethodService.addShippingMethod(dto));
    }

    @PutMapping
    public ResponseEntity<ShippingMethodDTO> updateShippingMethod(@RequestBody ShippingMethodDTO dto) {
        return ResponseEntity.ok(shippingMethodService.updateShippingMethod(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShippingMethod(@PathVariable Long id) {
        shippingMethodService.deleteShippingMethod(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<ShippingMethodDTO> getAllShippingMethods() {
        return shippingMethodService.getAllShippingMethods();
    }
} 