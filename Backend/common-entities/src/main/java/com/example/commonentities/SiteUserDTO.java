package com.example.commonentities;

import lombok.Data;
import java.util.List;

@Data
public class SiteUserDTO {
    private Long id;
    private String emailAddress;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private List<RoleDTO> roles;
} 