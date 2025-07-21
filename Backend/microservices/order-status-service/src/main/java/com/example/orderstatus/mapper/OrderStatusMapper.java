package com.example.orderstatus.mapper;

import com.example.orderstatus.dto.OrderStatusDTO;
import com.example.orderstatus.entity.OrderStatus;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderStatusMapper {
    OrderStatusDTO toDto(OrderStatus entity);
    OrderStatus toEntity(OrderStatusDTO dto);
} 