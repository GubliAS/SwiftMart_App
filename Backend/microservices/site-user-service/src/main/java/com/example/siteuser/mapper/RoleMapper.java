package com.example.siteuser.mapper;

import com.example.commonentities.Role;
import com.example.commonentities.RoleDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

    RoleDTO toDto(Role role);
    Role toEntity(RoleDTO roleDto);
} 