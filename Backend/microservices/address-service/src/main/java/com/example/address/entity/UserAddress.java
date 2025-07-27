package com.example.address.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_address")
@Data
public class UserAddress {
    @EmbeddedId
    private UserAddressId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("addressId")
    @JoinColumn(name = "address_id")
    private Address address;

    private Boolean isDefault;
} 