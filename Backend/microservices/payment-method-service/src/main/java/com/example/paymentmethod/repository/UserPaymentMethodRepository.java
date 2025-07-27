package com.example.paymentmethod.repository;

import com.example.paymentmethod.entity.UserPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPaymentMethodRepository extends JpaRepository<UserPaymentMethod, Long> {
    java.util.List<UserPaymentMethod> findByUser_Id(Long userId);
} 