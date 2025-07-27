package com.example.paymentmethod.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.example.commonentities.SiteUser;

@Entity
@Table(name = "user_payment_method")
@Data
public class UserPaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id")
    private PaymentType paymentType;

    private String provider;
    private String accountNumber;
    private LocalDate expiryDate;
    private Boolean isDefault;
} 