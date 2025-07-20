package com.example.shoppingcart.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "site-user-service", url = "${siteuser.service.url}")
public interface SiteUserClient {
    @GetMapping("/api/users/{id}")
    Object getUserById(@PathVariable("id") Long id);
} 