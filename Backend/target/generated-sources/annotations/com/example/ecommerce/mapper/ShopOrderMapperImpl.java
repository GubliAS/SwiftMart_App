package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShopOrderDTO;
import com.example.ecommerce.entity.ShippingMethod;
import com.example.ecommerce.entity.ShopOrder;
import com.example.ecommerce.entity.SiteUser;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:58+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ShopOrderMapperImpl implements ShopOrderMapper {

    @Override
    public ShopOrderDTO toDto(ShopOrder order) {
        if ( order == null ) {
            return null;
        }

        ShopOrderDTO shopOrderDTO = new ShopOrderDTO();

        shopOrderDTO.setUserId( orderUserId( order ) );
        shopOrderDTO.setShippingMethodId( orderShippingMethodId( order ) );
        shopOrderDTO.setId( order.getId() );
        shopOrderDTO.setOrderDate( order.getOrderDate() );
        shopOrderDTO.setOrderStatus( order.getOrderStatus() );
        shopOrderDTO.setOrderTotal( order.getOrderTotal() );
        shopOrderDTO.setPaymentMethodId( order.getPaymentMethodId() );
        shopOrderDTO.setShippingAddress( order.getShippingAddress() );

        return shopOrderDTO;
    }

    @Override
    public ShopOrder toEntity(ShopOrderDTO dto) {
        if ( dto == null ) {
            return null;
        }

        ShopOrder shopOrder = new ShopOrder();

        shopOrder.setUser( shopOrderDTOToSiteUser( dto ) );
        shopOrder.setShippingMethod( shopOrderDTOToShippingMethod( dto ) );
        shopOrder.setId( dto.getId() );
        shopOrder.setOrderDate( dto.getOrderDate() );
        shopOrder.setOrderStatus( dto.getOrderStatus() );
        shopOrder.setOrderTotal( dto.getOrderTotal() );
        shopOrder.setPaymentMethodId( dto.getPaymentMethodId() );
        shopOrder.setShippingAddress( dto.getShippingAddress() );

        return shopOrder;
    }

    private Long orderUserId(ShopOrder shopOrder) {
        if ( shopOrder == null ) {
            return null;
        }
        SiteUser user = shopOrder.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long orderShippingMethodId(ShopOrder shopOrder) {
        if ( shopOrder == null ) {
            return null;
        }
        ShippingMethod shippingMethod = shopOrder.getShippingMethod();
        if ( shippingMethod == null ) {
            return null;
        }
        Long id = shippingMethod.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected SiteUser shopOrderDTOToSiteUser(ShopOrderDTO shopOrderDTO) {
        if ( shopOrderDTO == null ) {
            return null;
        }

        SiteUser siteUser = new SiteUser();

        siteUser.setId( shopOrderDTO.getUserId() );

        return siteUser;
    }

    protected ShippingMethod shopOrderDTOToShippingMethod(ShopOrderDTO shopOrderDTO) {
        if ( shopOrderDTO == null ) {
            return null;
        }

        ShippingMethod shippingMethod = new ShippingMethod();

        shippingMethod.setId( shopOrderDTO.getShippingMethodId() );

        return shippingMethod;
    }
}
