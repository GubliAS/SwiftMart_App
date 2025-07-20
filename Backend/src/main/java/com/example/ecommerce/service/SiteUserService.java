package com.example.ecommerce.service;

import com.example.ecommerce.dto.SiteUserDTO;
import com.example.ecommerce.entity.SiteUser;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.mapper.SiteUserMapper;
import com.example.ecommerce.repository.SiteUserRepository;
import com.example.ecommerce.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SiteUserService implements UserDetailsService {
    private final SiteUserRepository userRepository;
    private final SiteUserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RoleRepository roleRepository;

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
        user.setPassword(passwordEncoder.encode(rawPassword));

        // Fix: fetch roles from DB
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
            user.setPassword(passwordEncoder.encode(rawPassword));
        }
        return userMapper.toDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Loading user by username: " + email);
        SiteUser user = userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        System.out.println("User found: " + user.getEmailAddress() + ", password length: " + user.getPassword().length());
        return new User(user.getEmailAddress(), user.getPassword(), Collections.emptyList());
    }

    public boolean checkEmailExists(String email) {
        return userRepository.findByEmailAddress(email).isPresent();
    }

    public void resetPassword(String email, String newPassword) {
        SiteUser user = userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public boolean changePassword(String email, String currentPassword, String newPassword) {
        SiteUser user = userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
} 