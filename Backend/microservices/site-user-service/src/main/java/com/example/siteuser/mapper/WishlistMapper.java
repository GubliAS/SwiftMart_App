package com.example.siteuser.mapper;

import com.example.commonentities.Wishlist;
import com.example.siteuser.dto.WishlistDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WishlistMapper {
    WishlistMapper INSTANCE = Mappers.getMapper(WishlistMapper.class);

    WishlistDTO toDto(Wishlist wishlist);
    Wishlist toEntity(WishlistDTO wishlistDto);
} 