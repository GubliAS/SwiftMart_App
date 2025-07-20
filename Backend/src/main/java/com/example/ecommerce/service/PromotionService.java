package com.example.ecommerce.service;

import com.example.ecommerce.dto.PromotionDTO;
import com.example.ecommerce.dto.PromotionCategoryDTO;
import com.example.ecommerce.entity.Promotion;
import com.example.ecommerce.entity.PromotionCategory;
import com.example.ecommerce.entity.PromotionCategoryId;
import com.example.ecommerce.mapper.PromotionMapper;
import com.example.ecommerce.mapper.PromotionCategoryMapper;
import com.example.ecommerce.repository.PromotionRepository;
import com.example.ecommerce.repository.PromotionCategoryRepository;
import com.example.ecommerce.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionCategoryRepository promotionCategoryRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final PromotionMapper promotionMapper;
    private final PromotionCategoryMapper promotionCategoryMapper;

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
        // Set references
        entity.setCategory(productCategoryRepository.findById(dto.getCategoryId()).orElseThrow());
        entity.setPromotion(promotionRepository.findById(dto.getPromotionId()).orElseThrow());
        return promotionCategoryMapper.toDto(promotionCategoryRepository.save(entity));
    }

    public List<PromotionDTO> getPromotionsByCategory(Long categoryId) {
        return promotionCategoryRepository.findAll().stream()
                .filter(pc -> pc.getCategory().getId().equals(categoryId))
                .map(pc -> promotionMapper.toDto(pc.getPromotion()))
                .collect(Collectors.toList());
    }
} 