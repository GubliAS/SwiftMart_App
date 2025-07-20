package com.example.ecommerce.service;

import com.example.ecommerce.dto.ShippingMethodDTO;
import com.example.ecommerce.entity.ShippingMethod;
import com.example.ecommerce.mapper.ShippingMethodMapper;
import com.example.ecommerce.repository.ShippingMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingMethodService {
    private final ShippingMethodRepository shippingMethodRepository;
    private final ShippingMethodMapper shippingMethodMapper;

    public ShippingMethodDTO addShippingMethod(ShippingMethodDTO dto) {
        ShippingMethod entity = shippingMethodMapper.toEntity(dto);
        return shippingMethodMapper.toDto(shippingMethodRepository.save(entity));
    }

    public ShippingMethodDTO updateShippingMethod(ShippingMethodDTO dto) {
        ShippingMethod entity = shippingMethodRepository.findById(dto.getId()).orElseThrow();
        entity.setName(dto.getName());
        entity.setPrice(dto.getPrice());
        return shippingMethodMapper.toDto(shippingMethodRepository.save(entity));
    }

    public void deleteShippingMethod(Long id) {
        shippingMethodRepository.deleteById(id);
    }

    public List<ShippingMethodDTO> getAllShippingMethods() {
        return shippingMethodRepository.findAll().stream()
                .map(shippingMethodMapper::toDto)
                .collect(Collectors.toList());
    }
} 