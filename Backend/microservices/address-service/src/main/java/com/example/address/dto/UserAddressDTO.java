package com.example.address.dto;

import com.example.address.entity.UserAddressId;
import lombok.Data;

@Data
public class UserAddressDTO {
    private UserAddressId id;
    private Long userId;
    private Long addressId;
    private Boolean isDefault;
} 