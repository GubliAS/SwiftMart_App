package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShoppingCartItemDTO;
import com.example.ecommerce.entity.ShoppingCartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShoppingCartItemMapper {
    @Mapping(source = "cart.id", target = "cartId")
    @Mapping(source = "productItem.id", target = "productItemId")
    ShoppingCartItemDTO toDto(ShoppingCartItem item);

    @Mapping(source = "cartId", target = "cart.id")
    @Mapping(source = "productItemId", target = "productItem.id")
    ShoppingCartItem toEntity(ShoppingCartItemDTO dto);
} 