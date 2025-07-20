package com.example.ecommerce.controller;

import com.example.ecommerce.dto.SiteUserDTO;
import com.example.ecommerce.service.SiteUserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class SiteUserController {
    private final SiteUserService userService;

    @GetMapping
    public List<SiteUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public SiteUserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public SiteUserDTO createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request.getUser(), request.getPassword());
    }

    @PutMapping("/{id}")
    public SiteUserDTO updateUser(@PathVariable Long id, @RequestBody CreateUserRequest request) {
        return userService.updateUser(id, request.getUser(), request.getPassword());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateUserRequest {
        private SiteUserDTO user;
        private String password;
    }
} 