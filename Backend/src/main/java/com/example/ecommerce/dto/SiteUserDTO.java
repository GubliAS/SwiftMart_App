package com.example.ecommerce.dto;

import lombok.Data;
import java.util.Set;

@Data
public class SiteUserDTO {
    private Long id;
    private String emailAddress;
    private String phoneNumber;
    private Set<RoleDTO> roles;
    private String password;
} 