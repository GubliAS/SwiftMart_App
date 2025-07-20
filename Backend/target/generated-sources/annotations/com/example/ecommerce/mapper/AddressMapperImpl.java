package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.AddressDTO;
import com.example.ecommerce.entity.Address;
import com.example.ecommerce.entity.Country;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:56+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressDTO toDto(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setCountryId( addressCountryId( address ) );
        addressDTO.setAddressLine1( address.getAddressLine1() );
        addressDTO.setAddressLine2( address.getAddressLine2() );
        addressDTO.setCity( address.getCity() );
        addressDTO.setId( address.getId() );
        addressDTO.setPostalCode( address.getPostalCode() );
        addressDTO.setRegion( address.getRegion() );
        addressDTO.setStreetNumber( address.getStreetNumber() );
        addressDTO.setUnitNumber( address.getUnitNumber() );

        return addressDTO;
    }

    @Override
    public Address toEntity(AddressDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Address address = new Address();

        address.setCountry( addressDTOToCountry( dto ) );
        address.setAddressLine1( dto.getAddressLine1() );
        address.setAddressLine2( dto.getAddressLine2() );
        address.setCity( dto.getCity() );
        address.setId( dto.getId() );
        address.setPostalCode( dto.getPostalCode() );
        address.setRegion( dto.getRegion() );
        address.setStreetNumber( dto.getStreetNumber() );
        address.setUnitNumber( dto.getUnitNumber() );

        return address;
    }

    private Long addressCountryId(Address address) {
        if ( address == null ) {
            return null;
        }
        Country country = address.getCountry();
        if ( country == null ) {
            return null;
        }
        Long id = country.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected Country addressDTOToCountry(AddressDTO addressDTO) {
        if ( addressDTO == null ) {
            return null;
        }

        Country country = new Country();

        country.setId( addressDTO.getCountryId() );

        return country;
    }
}
