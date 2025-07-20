package com.example.ecommerce.repository;

import com.example.ecommerce.entity.UserAddress;
import com.example.ecommerce.entity.UserAddressId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAddressRepository extends JpaRepository<UserAddress, UserAddressId> {
} 