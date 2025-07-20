package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.UserAddressDTO;
import com.example.ecommerce.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address.id", target = "addressId")
    UserAddressDTO toDto(UserAddress entity);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "addressId", target = "address.id")
    UserAddress toEntity(UserAddressDTO dto);
} 