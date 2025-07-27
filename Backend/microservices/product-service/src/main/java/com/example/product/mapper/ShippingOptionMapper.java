package com.example.product.mapper;

import com.example.product.dto.ShippingOptionDTO;
import com.example.product.entity.ShippingOption;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShippingOptionMapper {
    ShippingOptionDTO toDto(ShippingOption shippingOption);
    ShippingOption toEntity(ShippingOptionDTO dto);
} 