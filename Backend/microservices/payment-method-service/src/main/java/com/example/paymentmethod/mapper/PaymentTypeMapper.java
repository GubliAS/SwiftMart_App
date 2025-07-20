package com.example.paymentmethod.mapper;

import com.example.paymentmethod.dto.PaymentTypeDTO;
import com.example.paymentmethod.entity.PaymentType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentTypeMapper {
    PaymentTypeDTO toDto(PaymentType entity);
    PaymentType toEntity(PaymentTypeDTO dto);
} 