package com.example.address.repository;

import com.example.address.entity.UserAddress;
import com.example.address.entity.UserAddressId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAddressRepository extends JpaRepository<UserAddress, UserAddressId> {
} 