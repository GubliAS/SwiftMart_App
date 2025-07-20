package com.example.siteuser.service;

import com.example.siteuser.dto.SiteUserDTO;
import com.example.siteuser.dto.RoleDTO;
import com.example.siteuser.entity.SiteUser;
import com.example.siteuser.entity.Role;
import com.example.siteuser.mapper.SiteUserMapper;
import com.example.siteuser.repository.SiteUserRepository;
import com.example.siteuser.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SiteUserService {
    private final SiteUserRepository userRepository;
    private final SiteUserMapper userMapper;
    private final RoleRepository roleRepository;
    // private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Uncomment if using security

    public List<SiteUserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public SiteUserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public SiteUserDTO createUser(SiteUserDTO dto, String rawPassword) {
        SiteUser user = userMapper.toEntity(dto);
        user.setPassword(rawPassword); // Replace with encoded password if using security
        Set<Role> managedRoles = dto.getRoles().stream()
            .map(roleDto -> roleRepository.findByName(roleDto.getName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getName())))
            .collect(Collectors.toSet());
        user.setRoles(managedRoles);
        return userMapper.toDto(userRepository.save(user));
    }

    public SiteUserDTO updateUser(Long id, SiteUserDTO dto, String rawPassword) {
        SiteUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmailAddress(dto.getEmailAddress());
        user.setPhoneNumber(dto.getPhoneNumber());
        if (rawPassword != null && !rawPassword.isEmpty()) {
            user.setPassword(rawPassword); // Replace with encoded password if using security
        }
        return userMapper.toDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
} 