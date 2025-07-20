package com.example.ecommerce.service;

import com.example.ecommerce.dto.UserReviewDTO;
import com.example.ecommerce.entity.UserReview;
import com.example.ecommerce.mapper.UserReviewMapper;
import com.example.ecommerce.repository.UserReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserReviewService {
    private final UserReviewRepository reviewRepository;
    private final UserReviewMapper reviewMapper;

    public UserReviewDTO addReview(UserReviewDTO dto) {
        UserReview review = reviewMapper.toEntity(dto);
        return reviewMapper.toDto(reviewRepository.save(review));
    }

    public List<UserReviewDTO> getReviewsForProduct(Long orderedProductId) {
        return reviewRepository.findAll().stream()
                .filter(r -> r.getOrderedProductId().equals(orderedProductId))
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<UserReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findAll().stream()
                .filter(r -> r.getUser().getId().equals(userId))
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }
} 