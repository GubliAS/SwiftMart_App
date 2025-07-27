package com.example.siteuser.mapper;

import com.example.siteuser.dto.RoleDTO;
import com.example.siteuser.dto.SiteUserDTO;
import com.example.siteuser.entity.Role;
import com.example.siteuser.entity.SiteUser;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-25T11:12:06+0000",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class SiteUserMapperImpl implements SiteUserMapper {

    @Override
    public SiteUserDTO toDto(SiteUser user) {
        if ( user == null ) {
            return null;
        }

        SiteUserDTO siteUserDTO = new SiteUserDTO();

        siteUserDTO.setId( user.getId() );
        siteUserDTO.setEmailAddress( user.getEmailAddress() );
        siteUserDTO.setPhoneNumber( user.getPhoneNumber() );
        siteUserDTO.setRoles( roleSetToRoleDTOSet( user.getRoles() ) );
        siteUserDTO.setPassword( user.getPassword() );

        return siteUserDTO;
    }

    @Override
    public SiteUser toEntity(SiteUserDTO userDto) {
        if ( userDto == null ) {
            return null;
        }

        SiteUser siteUser = new SiteUser();

        siteUser.setId( userDto.getId() );
        siteUser.setEmailAddress( userDto.getEmailAddress() );
        siteUser.setPhoneNumber( userDto.getPhoneNumber() );
        siteUser.setPassword( userDto.getPassword() );
        siteUser.setRoles( roleDTOSetToRoleSet( userDto.getRoles() ) );

        return siteUser;
    }

    @Override
    public RoleDTO toDto(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleDTO roleDTO = new RoleDTO();

        roleDTO.setId( role.getId() );
        roleDTO.setName( role.getName() );

        return roleDTO;
    }

    @Override
    public Role toEntity(RoleDTO roleDto) {
        if ( roleDto == null ) {
            return null;
        }

        Role role = new Role();

        role.setId( roleDto.getId() );
        role.setName( roleDto.getName() );

        return role;
    }

    protected Set<RoleDTO> roleSetToRoleDTOSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleDTO> set1 = new LinkedHashSet<RoleDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( toDto( role ) );
        }

        return set1;
    }

    protected Set<Role> roleDTOSetToRoleSet(Set<RoleDTO> set) {
        if ( set == null ) {
            return null;
        }

        Set<Role> set1 = new LinkedHashSet<Role>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( RoleDTO roleDTO : set ) {
            set1.add( toEntity( roleDTO ) );
        }

        return set1;
    }
}
