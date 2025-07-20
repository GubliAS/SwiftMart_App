package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.AddressDTO;
import com.example.ecommerce.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(source = "country.id", target = "countryId")
    AddressDTO toDto(Address address);

    @Mapping(source = "countryId", target = "country.id")
    Address toEntity(AddressDTO dto);
}
