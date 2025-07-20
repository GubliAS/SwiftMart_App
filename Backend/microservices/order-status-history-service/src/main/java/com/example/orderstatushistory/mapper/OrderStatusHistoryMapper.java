package com.example.orderstatushistory.mapper;

import com.example.orderstatushistory.dto.OrderStatusHistoryDTO;
import com.example.orderstatushistory.entity.OrderStatusHistory;
import com.example.commonentities.ShopOrder;
import com.example.commonentities.OrderStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OrderStatusHistoryMapper {
    @Mapping(source = "order", target = "orderId", qualifiedByName = "orderToId")
    @Mapping(source = "status", target = "statusId", qualifiedByName = "statusToId")
    OrderStatusHistoryDTO toDto(OrderStatusHistory entity);

    @Mapping(target = "order", source = "orderId", qualifiedByName = "idToOrder")
    @Mapping(target = "status", source = "statusId", qualifiedByName = "idToStatus")
    OrderStatusHistory toEntity(OrderStatusHistoryDTO dto);

    @Named("orderToId")
    static Long orderToId(ShopOrder order) {
        return order != null ? order.getId() : null;
    }

    @Named("statusToId")
    static Long statusToId(OrderStatus status) {
        return status != null ? status.getId() : null;
    }

    @Named("idToOrder")
    static ShopOrder idToOrder(Long id) {
        if (id == null) return null;
        ShopOrder order = new ShopOrder();
        order.setId(id);
        return order;
    }

    @Named("idToStatus")
    static OrderStatus idToStatus(Long id) {
        if (id == null) return null;
        OrderStatus status = new OrderStatus();
        status.setId(id);
        return status;
    }
} 