package com.example.ecommerce.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserPaymentMethodDTO {
    private Long id;
    private Long userId;
    private Long paymentTypeId;
    private String provider;
    private String accountNumber;
    private LocalDate expiryDate;
    private Boolean isDefault;
} 