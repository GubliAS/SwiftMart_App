package com.example.shoporder.mapper;

import com.example.shoporder.dto.OrderLineDTO;
import com.example.shoporder.entity.OrderLine;
import com.example.commonentities.ShopOrder;
import com.example.commonentities.SiteUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OrderLineMapper {
    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "order", target = "orderId", qualifiedByName = "orderToId")
    @Mapping(source = "seller", target = "sellerId", qualifiedByName = "sellerToId")
    @Mapping(source = "itemStatus", target = "itemStatus")
    OrderLineDTO toDto(OrderLine orderLine);

    @Mapping(target = "productItem.id", source = "productItemId")
    @Mapping(target = "order", source = "orderId", qualifiedByName = "idToOrder")
    @Mapping(target = "seller", source = "sellerId", qualifiedByName = "idToSeller")
    @Mapping(target = "itemStatus", source = "itemStatus")
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

    @Named("sellerToId")
    static Long sellerToId(SiteUser seller) {
        return seller != null ? seller.getId() : null;
    }

    @Named("idToSeller")
    static SiteUser idToSeller(Long id) {
        if (id == null) return null;
        SiteUser seller = new SiteUser();
        seller.setId(id);
        return seller;
    }
} 