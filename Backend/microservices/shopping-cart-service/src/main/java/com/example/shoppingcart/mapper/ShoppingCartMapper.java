package com.example.shoppingcart.mapper;

import com.example.shoppingcart.entity.ShoppingCart;
import com.example.shoppingcart.dto.ShoppingCartDTO;
import com.example.shoppingcart.entity.ShoppingCartItem;
import com.example.shoppingcart.dto.ShoppingCartItemDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ShoppingCartMapper {
    ShoppingCartMapper INSTANCE = Mappers.getMapper(ShoppingCartMapper.class);

    ShoppingCartDTO toDto(ShoppingCart cart);
    ShoppingCart toEntity(ShoppingCartDTO cartDto);

    ShoppingCartItemDTO toDto(ShoppingCartItem item);
    ShoppingCartItem toEntity(ShoppingCartItemDTO itemDto);
} 