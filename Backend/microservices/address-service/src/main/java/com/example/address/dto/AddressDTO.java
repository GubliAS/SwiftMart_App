package com.example.address.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String unitNumber;
    private String streetNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String region;
    private String postalCode;
    private Long countryId;
    private String name;
    private String phone;
    private String street;
    private Boolean isDefault;
} 