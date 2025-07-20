package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.OrderLineDTO;
import com.example.ecommerce.entity.OrderLine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderLineMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "qty", target = "qty")
    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "order.id", target = "orderId")
    OrderLineDTO toDto(OrderLine orderLine);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "qty", target = "qty")
    @Mapping(source = "productItemId", target = "productItem.id")
    @Mapping(source = "orderId", target = "order.id")
    OrderLine toEntity(OrderLineDTO dto);
} 