package com.example.ecommerce.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class UserAddressId implements java.io.Serializable {
    private Long userId;
    private Long addressId;
} 