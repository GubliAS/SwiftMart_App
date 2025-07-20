package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.OrderStatusHistoryDTO;
import com.example.ecommerce.entity.OrderStatusHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderStatusHistoryMapper {
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "status.id", target = "statusId")
    OrderStatusHistoryDTO toDto(OrderStatusHistory entity);

    @Mapping(source = "orderId", target = "order.id")
    @Mapping(source = "statusId", target = "status.id")
    OrderStatusHistory toEntity(OrderStatusHistoryDTO dto);
} 