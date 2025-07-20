package com.example.ecommerce.dto;

import com.example.ecommerce.entity.UserAddressId;
import lombok.Data;

@Data
public class UserAddressDTO {
    private UserAddressId id;
    private Long userId;
    private Long addressId;
    private Boolean isDefault;
} 