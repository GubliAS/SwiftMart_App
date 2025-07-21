package com.example.commonentities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.FetchType;

@Entity
@Data
public class SiteUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String emailAddress;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    
    // Seller-specific fields
    private String storeName;
    private String idCardType;
    private String idCardCountry;
    private String idCardNumber;
    private Boolean isVerified = false;
    private String verificationStatus = "PENDING"; // PENDING, APPROVED, REJECTED
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
} 