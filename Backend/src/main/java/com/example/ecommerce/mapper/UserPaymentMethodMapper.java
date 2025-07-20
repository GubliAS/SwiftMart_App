package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.UserPaymentMethodDTO;
import com.example.ecommerce.entity.UserPaymentMethod;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPaymentMethodMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "paymentType.id", target = "paymentTypeId")
    UserPaymentMethodDTO toDto(UserPaymentMethod entity);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "paymentTypeId", target = "paymentType.id")
    UserPaymentMethod toEntity(UserPaymentMethodDTO dto);
} 