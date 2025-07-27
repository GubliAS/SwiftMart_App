package com.example.address.mapper;

import com.example.address.dto.AddressDTO;
import com.example.address.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(source = "country.id", target = "countryId")
    @Mapping(source = "unitNumber", target = "unitNumber")
    @Mapping(source = "streetNumber", target = "streetNumber")
    @Mapping(source = "addressLine1", target = "addressLine1")
    @Mapping(source = "addressLine2", target = "addressLine2")
    @Mapping(source = "city", target = "city")
    @Mapping(source = "region", target = "region")
    @Mapping(source = "postalCode", target = "postalCode")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "street", target = "street")
    AddressDTO toDto(Address address);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "countryId", target = "country.id")
    @Mapping(source = "unitNumber", target = "unitNumber")
    @Mapping(source = "streetNumber", target = "streetNumber")
    @Mapping(source = "addressLine1", target = "addressLine1")
    @Mapping(source = "addressLine2", target = "addressLine2")
    @Mapping(source = "city", target = "city")
    @Mapping(source = "region", target = "region")
    @Mapping(source = "postalCode", target = "postalCode")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "street", target = "street")
    Address toEntity(AddressDTO dto);
}
