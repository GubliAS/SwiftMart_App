package com.example.address.mapper;

import com.example.address.dto.UserAddressDTO;
import com.example.address.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {
    @Mapping(source = "id.userId", target = "userId")
    @Mapping(source = "address.id", target = "addressId")
    UserAddressDTO toDto(UserAddress entity);

    @Mapping(source = "userId", target = "id.userId")
    @Mapping(source = "addressId", target = "address.id")
    UserAddress toEntity(UserAddressDTO dto);
} 