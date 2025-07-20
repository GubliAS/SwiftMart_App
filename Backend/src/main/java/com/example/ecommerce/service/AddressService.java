package com.example.ecommerce.service;

import com.example.ecommerce.dto.AddressDTO;
import com.example.ecommerce.dto.UserAddressDTO;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.mapper.AddressMapper;
import com.example.ecommerce.mapper.UserAddressMapper;
import com.example.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserAddressRepository userAddressRepository;
    private final CountryRepository countryRepository;
    private final SiteUserRepository userRepository;
    private final AddressMapper addressMapper;
    private final UserAddressMapper userAddressMapper;

    public AddressDTO addAddress(AddressDTO dto) {
        Address address = addressMapper.toEntity(dto);
        address.setCountry(countryRepository.findById(dto.getCountryId()).orElseThrow());
        return addressMapper.toDto(addressRepository.save(address));
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
        return userAddressRepository.findAll().stream()
                .filter(ua -> ua.getUser().getId().equals(userId))
                .map(ua -> addressMapper.toDto(ua.getAddress()))
                .collect(Collectors.toList());
    }

    public void linkAddressToUser(UserAddressDTO dto) {
        UserAddress entity = userAddressMapper.toEntity(dto);
        UserAddressId id = new UserAddressId();
        id.setUserId(dto.getUserId());
        id.setAddressId(dto.getAddressId());
        entity.setId(id);
        entity.setUser(userRepository.findById(dto.getUserId()).orElseThrow());
        entity.setAddress(addressRepository.findById(dto.getAddressId()).orElseThrow());
        entity.setIsDefault(dto.getIsDefault());
        // If setting as default, unset other defaults for this user
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            userAddressRepository.findAll().stream()
                .filter(ua -> ua.getUser().getId().equals(dto.getUserId()) && Boolean.TRUE.equals(ua.getIsDefault()))
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
                .filter(ua -> ua.getUser().getId().equals(userId) && Boolean.TRUE.equals(ua.getIsDefault()))
                .findFirst()
                .map(ua -> addressMapper.toDto(ua.getAddress()))
                .orElse(null);
    }
} 