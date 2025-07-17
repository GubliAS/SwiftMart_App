package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShippingMethodDTO;
import com.example.ecommerce.entity.ShippingMethod;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:59+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ShippingMethodMapperImpl implements ShippingMethodMapper {

    @Override
    public ShippingMethodDTO toDto(ShippingMethod entity) {
        if ( entity == null ) {
            return null;
        }

        ShippingMethodDTO shippingMethodDTO = new ShippingMethodDTO();

        shippingMethodDTO.setId( entity.getId() );
        shippingMethodDTO.setName( entity.getName() );
        shippingMethodDTO.setPrice( entity.getPrice() );

        return shippingMethodDTO;
    }

    @Override
    public ShippingMethod toEntity(ShippingMethodDTO dto) {
        if ( dto == null ) {
            return null;
        }

        ShippingMethod shippingMethod = new ShippingMethod();

        shippingMethod.setId( dto.getId() );
        shippingMethod.setName( dto.getName() );
        shippingMethod.setPrice( dto.getPrice() );

        return shippingMethod;
    }
}
