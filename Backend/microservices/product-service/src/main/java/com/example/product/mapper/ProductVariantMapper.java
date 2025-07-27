package com.example.product.mapper;

import com.example.product.dto.ProductVariantDTO;
import com.example.product.entity.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariantDTO toDto(ProductVariant productVariant);
    ProductVariant toEntity(ProductVariantDTO dto);
} 