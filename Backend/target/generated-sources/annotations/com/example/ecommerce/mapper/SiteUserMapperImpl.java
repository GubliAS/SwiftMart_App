package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.RoleDTO;
import com.example.ecommerce.dto.SiteUserDTO;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.SiteUser;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:30:00+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class SiteUserMapperImpl implements SiteUserMapper {

    @Override
    public SiteUserDTO toDto(SiteUser user) {
        if ( user == null ) {
            return null;
        }

        SiteUserDTO siteUserDTO = new SiteUserDTO();

        siteUserDTO.setEmailAddress( user.getEmailAddress() );
        siteUserDTO.setId( user.getId() );
        siteUserDTO.setPassword( user.getPassword() );
        siteUserDTO.setPhoneNumber( user.getPhoneNumber() );
        siteUserDTO.setRoles( roleSetToRoleDTOSet( user.getRoles() ) );

        return siteUserDTO;
    }

    @Override
    public SiteUser toEntity(SiteUserDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SiteUser siteUser = new SiteUser();

        siteUser.setEmailAddress( dto.getEmailAddress() );
        siteUser.setId( dto.getId() );
        siteUser.setPassword( dto.getPassword() );
        siteUser.setPhoneNumber( dto.getPhoneNumber() );
        siteUser.setRoles( roleDTOSetToRoleSet( dto.getRoles() ) );

        return siteUser;
    }

    protected RoleDTO roleToRoleDTO(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleDTO roleDTO = new RoleDTO();

        roleDTO.setId( role.getId() );
        roleDTO.setName( role.getName() );

        return roleDTO;
    }

    protected Set<RoleDTO> roleSetToRoleDTOSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleDTO> set1 = new LinkedHashSet<RoleDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleDTO( role ) );
        }

        return set1;
    }

    protected Role roleDTOToRole(RoleDTO roleDTO) {
        if ( roleDTO == null ) {
            return null;
        }

        Role role = new Role();

        role.setId( roleDTO.getId() );
        role.setName( roleDTO.getName() );

        return role;
    }

    protected Set<Role> roleDTOSetToRoleSet(Set<RoleDTO> set) {
        if ( set == null ) {
            return null;
        }

        Set<Role> set1 = new LinkedHashSet<Role>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( RoleDTO roleDTO : set ) {
            set1.add( roleDTOToRole( roleDTO ) );
        }

        return set1;
    }
}
