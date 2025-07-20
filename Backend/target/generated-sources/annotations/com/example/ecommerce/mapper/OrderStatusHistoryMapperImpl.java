package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.OrderStatusHistoryDTO;
import com.example.ecommerce.entity.OrderStatus;
import com.example.ecommerce.entity.OrderStatusHistory;
import com.example.ecommerce.entity.ShopOrder;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:59+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class OrderStatusHistoryMapperImpl implements OrderStatusHistoryMapper {

    @Override
    public OrderStatusHistoryDTO toDto(OrderStatusHistory entity) {
        if ( entity == null ) {
            return null;
        }

        OrderStatusHistoryDTO orderStatusHistoryDTO = new OrderStatusHistoryDTO();

        orderStatusHistoryDTO.setOrderId( entityOrderId( entity ) );
        orderStatusHistoryDTO.setStatusId( entityStatusId( entity ) );
        orderStatusHistoryDTO.setChangedAt( entity.getChangedAt() );
        orderStatusHistoryDTO.setId( entity.getId() );

        return orderStatusHistoryDTO;
    }

    @Override
    public OrderStatusHistory toEntity(OrderStatusHistoryDTO dto) {
        if ( dto == null ) {
            return null;
        }

        OrderStatusHistory orderStatusHistory = new OrderStatusHistory();

        orderStatusHistory.setOrder( orderStatusHistoryDTOToShopOrder( dto ) );
        orderStatusHistory.setStatus( orderStatusHistoryDTOToOrderStatus( dto ) );
        orderStatusHistory.setChangedAt( dto.getChangedAt() );
        orderStatusHistory.setId( dto.getId() );

        return orderStatusHistory;
    }

    private Long entityOrderId(OrderStatusHistory orderStatusHistory) {
        if ( orderStatusHistory == null ) {
            return null;
        }
        ShopOrder order = orderStatusHistory.getOrder();
        if ( order == null ) {
            return null;
        }
        Long id = order.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long entityStatusId(OrderStatusHistory orderStatusHistory) {
        if ( orderStatusHistory == null ) {
            return null;
        }
        OrderStatus status = orderStatusHistory.getStatus();
        if ( status == null ) {
            return null;
        }
        Long id = status.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected ShopOrder orderStatusHistoryDTOToShopOrder(OrderStatusHistoryDTO orderStatusHistoryDTO) {
        if ( orderStatusHistoryDTO == null ) {
            return null;
        }

        ShopOrder shopOrder = new ShopOrder();

        shopOrder.setId( orderStatusHistoryDTO.getOrderId() );

        return shopOrder;
    }

    protected OrderStatus orderStatusHistoryDTOToOrderStatus(OrderStatusHistoryDTO orderStatusHistoryDTO) {
        if ( orderStatusHistoryDTO == null ) {
            return null;
        }

        OrderStatus orderStatus = new OrderStatus();

        orderStatus.setId( orderStatusHistoryDTO.getStatusId() );

        return orderStatus;
    }
}
