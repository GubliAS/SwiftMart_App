package com.example.shoporder.mapper;

import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.entity.OrderLine;
import com.example.commonentities.ShopOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OrderLineMapper {
    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "order", target = "orderId", qualifiedByName = "orderToId")
    OrderLineDTO toDto(OrderLine orderLine);

    @Mapping(target = "productItem.id", source = "productItemId")
    @Mapping(target = "order", source = "orderId", qualifiedByName = "idToOrder")
    OrderLine toEntity(OrderLineDTO dto);

    @Named("orderToId")
    static Long orderToId(ShopOrder order) {
        return order != null ? order.getId() : null;
    }

    @Named("idToOrder")
    static ShopOrder idToOrder(Long id) {
        if (id == null) return null;
        ShopOrder order = new ShopOrder();
        order.setId(id);
        return order;
    }
} 