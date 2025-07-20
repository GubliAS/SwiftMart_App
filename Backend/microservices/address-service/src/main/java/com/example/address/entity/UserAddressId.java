package com.example.address.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Embeddable
@Data
public class UserAddressId implements Serializable {
    private Long userId;
    private Long addressId;
} 