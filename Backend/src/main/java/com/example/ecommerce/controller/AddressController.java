package com.example.ecommerce.controller;

import com.example.ecommerce.dto.AddressDTO;
import com.example.ecommerce.dto.UserAddressDTO;
import com.example.ecommerce.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(@RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.addAddress(dto));
    }

    @PutMapping
    public ResponseEntity<AddressDTO> updateAddress(@RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.updateAddress(dto));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public List<AddressDTO> getAddressesForUser(@PathVariable Long userId) {
        return addressService.getAddressesForUser(userId);
    }

    @PostMapping("/link")
    public ResponseEntity<Void> linkAddressToUser(@RequestBody UserAddressDTO dto) {
        addressService.linkAddressToUser(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/address/{addressId}")
    public ResponseEntity<Void> removeUserAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        addressService.removeUserAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<AddressDTO> getDefaultAddressForUser(@PathVariable Long userId) {
        AddressDTO dto = addressService.getDefaultAddressForUser(userId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }
} 