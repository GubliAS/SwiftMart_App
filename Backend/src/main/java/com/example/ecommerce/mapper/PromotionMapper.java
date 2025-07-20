package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.PromotionDTO;
import com.example.ecommerce.entity.Promotion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    PromotionDTO toDto(Promotion promotion);
    Promotion toEntity(PromotionDTO dto);
} 