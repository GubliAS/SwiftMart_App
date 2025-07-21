package com.example.promotion.service;

import com.example.promotion.dto.PromotionDTO;
import com.example.promotion.dto.PromotionCategoryDTO;
import com.example.promotion.entity.Promotion;
import com.example.promotion.entity.PromotionCategory;
import com.example.promotion.entity.PromotionCategoryId;
import com.example.promotion.mapper.PromotionMapper;
import com.example.promotion.mapper.PromotionCategoryMapper;
import com.example.promotion.repository.PromotionRepository;
import com.example.promotion.repository.PromotionCategoryRepository;
import com.example.promotion.client.ProductCategoryClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionCategoryRepository promotionCategoryRepository;
    private final PromotionMapper promotionMapper;
    private final PromotionCategoryMapper promotionCategoryMapper;
    private final ProductCategoryClient productCategoryClient;

    public PromotionDTO createPromotion(PromotionDTO dto) {
        Promotion promotion = promotionMapper.toEntity(dto);
        return promotionMapper.toDto(promotionRepository.save(promotion));
    }

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toDto)
                .collect(Collectors.toList());
    }

    public PromotionCategoryDTO assignPromotionToCategory(PromotionCategoryDTO dto) {
        PromotionCategory entity = promotionCategoryMapper.toEntity(dto);
        // Set composite key
        PromotionCategoryId id = new PromotionCategoryId();
        id.setCategoryId(dto.getCategoryId());
        id.setPromotionId(dto.getPromotionId());
        entity.setId(id);
        // Set references using Feign client
        entity.setCategory(productCategoryClient.getCategoryById(dto.getCategoryId()));
        entity.setPromotion(promotionRepository.findById(dto.getPromotionId()).orElseThrow());
        return promotionCategoryMapper.toDto(promotionCategoryRepository.save(entity));
    }

    public List<PromotionDTO> getPromotionsByCategory(Long categoryId) {
        return promotionCategoryRepository.findAll().stream()
                .filter(pc -> pc.getCategory() != null && pc.getCategory().getId().equals(categoryId))
                .map(pc -> promotionMapper.toDto(pc.getPromotion()))
                .collect(Collectors.toList());
    }
} 