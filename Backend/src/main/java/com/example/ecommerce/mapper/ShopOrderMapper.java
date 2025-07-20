package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShopOrderDTO;
import com.example.ecommerce.entity.ShopOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShopOrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "shippingMethod.id", target = "shippingMethodId")
    ShopOrderDTO toDto(ShopOrder order);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "shippingMethodId", target = "shippingMethod.id")
    ShopOrder toEntity(ShopOrderDTO dto);
} 