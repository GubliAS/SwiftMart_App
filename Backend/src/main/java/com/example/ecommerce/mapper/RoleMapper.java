package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.RoleDTO;
import com.example.ecommerce.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toDto(Role entity);
    Role toEntity(RoleDTO dto);
} 