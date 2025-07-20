package com.example.ecommerce.controller;

import com.example.ecommerce.dto.UserReviewDTO;
import com.example.ecommerce.service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class UserReviewController {
    private final UserReviewService reviewService;

    @PostMapping
    public ResponseEntity<UserReviewDTO> addReview(@RequestBody UserReviewDTO dto) {
        return ResponseEntity.ok(reviewService.addReview(dto));
    }

    @GetMapping("/product/{orderedProductId}")
    public List<UserReviewDTO> getReviewsForProduct(@PathVariable Long orderedProductId) {
        return reviewService.getReviewsForProduct(orderedProductId);
    }

    @GetMapping("/user/{userId}")
    public List<UserReviewDTO> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }
} 