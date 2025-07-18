package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.UserPaymentMethodDTO;
import com.example.ecommerce.entity.PaymentType;
import com.example.ecommerce.entity.SiteUser;
import com.example.ecommerce.entity.UserPaymentMethod;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:57+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserPaymentMethodMapperImpl implements UserPaymentMethodMapper {

    @Override
    public UserPaymentMethodDTO toDto(UserPaymentMethod entity) {
        if ( entity == null ) {
            return null;
        }

        UserPaymentMethodDTO userPaymentMethodDTO = new UserPaymentMethodDTO();

        userPaymentMethodDTO.setUserId( entityUserId( entity ) );
        userPaymentMethodDTO.setPaymentTypeId( entityPaymentTypeId( entity ) );
        userPaymentMethodDTO.setAccountNumber( entity.getAccountNumber() );
        userPaymentMethodDTO.setExpiryDate( entity.getExpiryDate() );
        userPaymentMethodDTO.setId( entity.getId() );
        userPaymentMethodDTO.setIsDefault( entity.getIsDefault() );
        userPaymentMethodDTO.setProvider( entity.getProvider() );

        return userPaymentMethodDTO;
    }

    @Override
    public UserPaymentMethod toEntity(UserPaymentMethodDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserPaymentMethod userPaymentMethod = new UserPaymentMethod();

        userPaymentMethod.setUser( userPaymentMethodDTOToSiteUser( dto ) );
        userPaymentMethod.setPaymentType( userPaymentMethodDTOToPaymentType( dto ) );
        userPaymentMethod.setAccountNumber( dto.getAccountNumber() );
        userPaymentMethod.setExpiryDate( dto.getExpiryDate() );
        userPaymentMethod.setId( dto.getId() );
        userPaymentMethod.setIsDefault( dto.getIsDefault() );
        userPaymentMethod.setProvider( dto.getProvider() );

        return userPaymentMethod;
    }

    private Long entityUserId(UserPaymentMethod userPaymentMethod) {
        if ( userPaymentMethod == null ) {
            return null;
        }
        SiteUser user = userPaymentMethod.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long entityPaymentTypeId(UserPaymentMethod userPaymentMethod) {
        if ( userPaymentMethod == null ) {
            return null;
        }
        PaymentType paymentType = userPaymentMethod.getPaymentType();
        if ( paymentType == null ) {
            return null;
        }
        Long id = paymentType.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected SiteUser userPaymentMethodDTOToSiteUser(UserPaymentMethodDTO userPaymentMethodDTO) {
        if ( userPaymentMethodDTO == null ) {
            return null;
        }

        SiteUser siteUser = new SiteUser();

        siteUser.setId( userPaymentMethodDTO.getUserId() );

        return siteUser;
    }

    protected PaymentType userPaymentMethodDTOToPaymentType(UserPaymentMethodDTO userPaymentMethodDTO) {
        if ( userPaymentMethodDTO == null ) {
            return null;
        }

        PaymentType paymentType = new PaymentType();

        paymentType.setId( userPaymentMethodDTO.getPaymentTypeId() );

        return paymentType;
    }
}
