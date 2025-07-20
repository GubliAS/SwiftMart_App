package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.OrderStatusDTO;
import com.example.ecommerce.entity.OrderStatus;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderStatusMapper {
    OrderStatusDTO toDto(OrderStatus entity);
    OrderStatus toEntity(OrderStatusDTO dto);
} 