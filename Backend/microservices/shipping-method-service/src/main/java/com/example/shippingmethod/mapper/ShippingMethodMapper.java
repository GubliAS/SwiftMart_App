package com.example.shippingmethod.mapper;

import com.example.shippingmethod.dto.ShippingMethodDTO;
import com.example.shippingmethod.entity.ShippingMethod;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShippingMethodMapper {
    ShippingMethodDTO toDto(ShippingMethod entity);
    ShippingMethod toEntity(ShippingMethodDTO dto);
} 