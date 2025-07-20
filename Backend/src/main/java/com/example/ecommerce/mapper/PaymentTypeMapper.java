package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.PaymentTypeDTO;
import com.example.ecommerce.entity.PaymentType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentTypeMapper {
    PaymentTypeDTO toDto(PaymentType entity);
    PaymentType toEntity(PaymentTypeDTO dto);
} 