package com.example.promotion.controller;

import com.example.promotion.dto.PromotionDTO;
import com.example.promotion.dto.PromotionCategoryDTO;
import com.example.promotion.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO dto) {
        return ResponseEntity.ok(promotionService.createPromotion(dto));
    }

    @GetMapping
    public List<PromotionDTO> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @PostMapping("/assign")
    public ResponseEntity<PromotionCategoryDTO> assignPromotionToCategory(@RequestBody PromotionCategoryDTO dto) {
        return ResponseEntity.ok(promotionService.assignPromotionToCategory(dto));
    }

    @GetMapping("/category/{categoryId}")
    public List<PromotionDTO> getPromotionsByCategory(@PathVariable Long categoryId) {
        return promotionService.getPromotionsByCategory(categoryId);
    }
} 