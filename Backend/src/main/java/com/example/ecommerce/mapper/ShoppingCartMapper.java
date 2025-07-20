package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShoppingCartDTO;
import com.example.ecommerce.entity.ShoppingCart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShoppingCartMapper {
    @Mapping(source = "user.id", target = "userId")
    ShoppingCartDTO toDto(ShoppingCart cart);

    @Mapping(source = "userId", target = "user.id")
    ShoppingCart toEntity(ShoppingCartDTO dto);
} 