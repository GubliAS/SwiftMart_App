package com.example.siteuser.mapper;

import com.example.siteuser.entity.SiteUser;
import com.example.siteuser.dto.SiteUserDTO;
import com.example.siteuser.entity.Role;
import com.example.siteuser.dto.RoleDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SiteUserMapper {
    SiteUserMapper INSTANCE = Mappers.getMapper(SiteUserMapper.class);

    SiteUserDTO toDto(SiteUser user);
    SiteUser toEntity(SiteUserDTO userDto);

    RoleDTO toDto(Role role);
    Role toEntity(RoleDTO roleDto);
} 