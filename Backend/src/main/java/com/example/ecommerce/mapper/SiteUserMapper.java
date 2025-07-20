package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.SiteUserDTO;
import com.example.ecommerce.entity.SiteUser;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SiteUserMapper {
    SiteUserDTO toDto(SiteUser user);
    SiteUser toEntity(SiteUserDTO dto);
} 