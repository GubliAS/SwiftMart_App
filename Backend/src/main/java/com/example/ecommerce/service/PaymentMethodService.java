package com.example.ecommerce.service;

import com.example.ecommerce.dto.PaymentTypeDTO;
import com.example.ecommerce.dto.UserPaymentMethodDTO;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.mapper.PaymentTypeMapper;
import com.example.ecommerce.mapper.UserPaymentMethodMapper;
import com.example.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {
    private final UserPaymentMethodRepository userPaymentMethodRepository;
    private final PaymentTypeRepository paymentTypeRepository;
    private final SiteUserRepository userRepository;
    private final PaymentTypeMapper paymentTypeMapper;
    private final UserPaymentMethodMapper userPaymentMethodMapper;

    public UserPaymentMethodDTO addPaymentMethod(UserPaymentMethodDTO dto) {
        UserPaymentMethod entity = userPaymentMethodMapper.toEntity(dto);
        entity.setUser(userRepository.findById(dto.getUserId()).orElseThrow());
        entity.setPaymentType(paymentTypeRepository.findById(dto.getPaymentTypeId()).orElseThrow());
        // If setting as default, unset other defaults for this user
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            userPaymentMethodRepository.findAll().stream()
                .filter(pm -> pm.getUser().getId().equals(dto.getUserId()) && Boolean.TRUE.equals(pm.getIsDefault()))
                .forEach(pm -> { pm.setIsDefault(false); userPaymentMethodRepository.save(pm); });
        }
        return userPaymentMethodMapper.toDto(userPaymentMethodRepository.save(entity));
    }

    public void deletePaymentMethod(Long id) {
        userPaymentMethodRepository.deleteById(id);
    }

    public UserPaymentMethodDTO updatePaymentMethod(UserPaymentMethodDTO dto) {
        UserPaymentMethod entity = userPaymentMethodRepository.findById(dto.getId()).orElseThrow();
        entity.setProvider(dto.getProvider());
        entity.setAccountNumber(dto.getAccountNumber());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setPaymentType(paymentTypeRepository.findById(dto.getPaymentTypeId()).orElseThrow());
        // If setting as default, unset other defaults for this user
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            userPaymentMethodRepository.findAll().stream()
                .filter(pm -> pm.getUser().getId().equals(dto.getUserId()) && Boolean.TRUE.equals(pm.getIsDefault()))
                .forEach(pm -> { pm.setIsDefault(false); userPaymentMethodRepository.save(pm); });
        }
        entity.setIsDefault(dto.getIsDefault());
        return userPaymentMethodMapper.toDto(userPaymentMethodRepository.save(entity));
    }

    public List<UserPaymentMethodDTO> getPaymentMethodsForUser(Long userId) {
        return userPaymentMethodRepository.findAll().stream()
                .filter(pm -> pm.getUser().getId().equals(userId))
                .map(userPaymentMethodMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserPaymentMethodDTO getDefaultPaymentMethodForUser(Long userId) {
        return userPaymentMethodRepository.findAll().stream()
                .filter(pm -> pm.getUser().getId().equals(userId) && Boolean.TRUE.equals(pm.getIsDefault()))
                .findFirst()
                .map(userPaymentMethodMapper::toDto)
                .orElse(null);
    }

    public List<PaymentTypeDTO> getAllPaymentTypes() {
        return paymentTypeRepository.findAll().stream()
                .map(paymentTypeMapper::toDto)
                .collect(Collectors.toList());
    }
} 