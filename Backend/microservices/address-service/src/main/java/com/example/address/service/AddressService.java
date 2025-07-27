package com.example.address.service;

import com.example.address.dto.AddressDTO;
import com.example.address.dto.UserAddressDTO;
import com.example.address.entity.*;
import com.example.address.mapper.AddressMapper;
import com.example.address.mapper.UserAddressMapper;
import com.example.address.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private static final Logger logger = LoggerFactory.getLogger(AddressService.class);
    private final AddressRepository addressRepository;
    private final UserAddressRepository userAddressRepository;
    private final CountryRepository countryRepository;
    private final AddressMapper addressMapper;
    private final UserAddressMapper userAddressMapper;

    public AddressDTO addAddress(AddressDTO dto) {
        logger.info("Saving address: name={}, phone={}, street={}", dto.getName(), dto.getPhone(), dto.getStreet());
        Address address = addressMapper.toEntity(dto);
        address.setCountry(countryRepository.findById(dto.getCountryId()).orElseThrow());
        Address saved = addressRepository.save(address);
        logger.info("Saved address entity: {}", saved);
        return addressMapper.toDto(saved);
    }

    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }

    public AddressDTO updateAddress(AddressDTO dto) {
        Address address = addressRepository.findById(dto.getId()).orElseThrow();
        address.setUnitNumber(dto.getUnitNumber());
        address.setStreetNumber(dto.getStreetNumber());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setRegion(dto.getRegion());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(countryRepository.findById(dto.getCountryId()).orElseThrow());
        return addressMapper.toDto(addressRepository.save(address));
    }

    public List<AddressDTO> getAddressesForUser(Long userId) {
        List<AddressDTO> addresses = userAddressRepository.findAll().stream()
                .filter(ua -> ua.getId().getUserId().equals(userId))
                .map(ua -> {
                    AddressDTO dto = addressMapper.toDto(ua.getAddress());
                    dto.setIsDefault(ua.getIsDefault());
                    return dto;
                })
                .collect(Collectors.toList());
        logger.info("Returning addresses for user {}: {}", userId, addresses);
        return addresses;
    }

    public void linkAddressToUser(UserAddressDTO dto) {
        UserAddress entity = userAddressMapper.toEntity(dto);
        UserAddressId id = new UserAddressId();
        id.setUserId(dto.getUserId());
        id.setAddressId(dto.getAddressId());
        entity.setId(id);
        // userId is set via id
        entity.setAddress(addressRepository.findById(dto.getAddressId()).orElseThrow());
        entity.setIsDefault(dto.getIsDefault());
        // If setting as default, unset other defaults for this user
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            userAddressRepository.findAll().stream()
                .filter(ua -> ua.getId().getUserId().equals(dto.getUserId()) && Boolean.TRUE.equals(ua.getIsDefault()))
                .forEach(ua -> { ua.setIsDefault(false); userAddressRepository.save(ua); });
        }
        userAddressRepository.save(entity);
    }

    public void removeUserAddress(Long userId, Long addressId) {
        UserAddressId id = new UserAddressId();
        id.setUserId(userId);
        id.setAddressId(addressId);
        userAddressRepository.deleteById(id);
    }

    public AddressDTO getDefaultAddressForUser(Long userId) {
        return userAddressRepository.findAll().stream()
                .filter(ua -> ua.getId().getUserId().equals(userId) && Boolean.TRUE.equals(ua.getIsDefault()))
                .findFirst()
                .map(ua -> {
                    AddressDTO dto = addressMapper.toDto(ua.getAddress());
                    dto.setIsDefault(ua.getIsDefault());
                    return dto;
                })
                .orElse(null);
    }
} 