package com.example.promotion.mapper;

import com.example.promotion.dto.PromotionDTO;
import com.example.promotion.entity.Promotion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    PromotionDTO toDto(Promotion promotion);
    Promotion toEntity(PromotionDTO dto);
} 