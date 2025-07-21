package com.example.paymentmethod.repository;

import com.example.paymentmethod.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTypeRepository extends JpaRepository<PaymentType, Long> {
} 