package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShippingMethodDTO;
import com.example.ecommerce.entity.ShippingMethod;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShippingMethodMapper {
    ShippingMethodDTO toDto(ShippingMethod entity);
    ShippingMethod toEntity(ShippingMethodDTO dto);
} 