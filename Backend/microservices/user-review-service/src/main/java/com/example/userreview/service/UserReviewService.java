package com.example.userreview.service;

import com.example.userreview.dto.UserReviewDTO;
import com.example.userreview.entity.UserReview;
import com.example.userreview.mapper.UserReviewMapper;
import com.example.userreview.repository.UserReviewRepository;
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
                .filter(r -> r.getUser() != null && r.getUser().getId().equals(userId))
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }
} 