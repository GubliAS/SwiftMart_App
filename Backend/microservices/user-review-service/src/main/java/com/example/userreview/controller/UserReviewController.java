package com.example.userreview.controller;

import com.example.userreview.dto.UserReviewDTO;
import com.example.userreview.service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserReviewController {
    private final UserReviewService reviewService;

    @PostMapping
    public ResponseEntity<UserReviewDTO> addReview(@RequestBody UserReviewDTO dto) {
        return ResponseEntity.ok(reviewService.addReview(dto));
    }

    @GetMapping("/product/{orderedProductId}")
    public List<UserReviewDTO> getReviewsForProduct(@PathVariable("orderedProductId") Long orderedProductId) {
        return reviewService.getReviewsForProduct(orderedProductId);
    }

    @GetMapping("/by-product/{productId}")
    public List<UserReviewDTO> getReviewsByProductId(@PathVariable("productId") Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @GetMapping("/user/{userId}")
    public List<UserReviewDTO> getReviewsByUser(@PathVariable("userId") Long userId) {
        return reviewService.getReviewsByUser(userId);
    }
} 