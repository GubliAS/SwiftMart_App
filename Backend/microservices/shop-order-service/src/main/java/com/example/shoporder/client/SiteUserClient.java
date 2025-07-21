package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.commonentities.SiteUserDTO;

@FeignClient(name = "site-user-service", url = "${siteuser.service.url}")
public interface SiteUserClient {
    @GetMapping("/api/users/{id}")
    SiteUserDTO getUserById(@PathVariable("id") Long id);
} 