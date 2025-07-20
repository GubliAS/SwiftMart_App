package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.PromotionCategoryDTO;
import com.example.ecommerce.entity.PromotionCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PromotionCategoryMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "promotion.id", target = "promotionId")
    PromotionCategoryDTO toDto(PromotionCategory entity);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "promotionId", target = "promotion.id")
    PromotionCategory toEntity(PromotionCategoryDTO dto);
} 