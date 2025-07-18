package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.UserAddressDTO;
import com.example.ecommerce.entity.Address;
import com.example.ecommerce.entity.SiteUser;
import com.example.ecommerce.entity.UserAddress;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:58+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserAddressMapperImpl implements UserAddressMapper {

    @Override
    public UserAddressDTO toDto(UserAddress entity) {
        if ( entity == null ) {
            return null;
        }

        UserAddressDTO userAddressDTO = new UserAddressDTO();

        userAddressDTO.setUserId( entityUserId( entity ) );
        userAddressDTO.setAddressId( entityAddressId( entity ) );
        userAddressDTO.setId( entity.getId() );
        userAddressDTO.setIsDefault( entity.getIsDefault() );

        return userAddressDTO;
    }

    @Override
    public UserAddress toEntity(UserAddressDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserAddress userAddress = new UserAddress();

        userAddress.setUser( userAddressDTOToSiteUser( dto ) );
        userAddress.setAddress( userAddressDTOToAddress( dto ) );
        userAddress.setId( dto.getId() );
        userAddress.setIsDefault( dto.getIsDefault() );

        return userAddress;
    }

    private Long entityUserId(UserAddress userAddress) {
        if ( userAddress == null ) {
            return null;
        }
        SiteUser user = userAddress.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long entityAddressId(UserAddress userAddress) {
        if ( userAddress == null ) {
            return null;
        }
        Address address = userAddress.getAddress();
        if ( address == null ) {
            return null;
        }
        Long id = address.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected SiteUser userAddressDTOToSiteUser(UserAddressDTO userAddressDTO) {
        if ( userAddressDTO == null ) {
            return null;
        }

        SiteUser siteUser = new SiteUser();

        siteUser.setId( userAddressDTO.getUserId() );

        return siteUser;
    }

    protected Address userAddressDTOToAddress(UserAddressDTO userAddressDTO) {
        if ( userAddressDTO == null ) {
            return null;
        }

        Address address = new Address();

        address.setId( userAddressDTO.getAddressId() );

        return address;
    }
}
