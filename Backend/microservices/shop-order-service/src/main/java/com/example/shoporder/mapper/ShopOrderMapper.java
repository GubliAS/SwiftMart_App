package com.example.shoporder.mapper;

import com.example.shoporder.dto.ShopOrderDTO;
import com.example.commonentities.ShopOrder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShopOrderMapper {
    ShopOrderDTO toDto(ShopOrder order);
    ShopOrder toEntity(ShopOrderDTO dto);
} 