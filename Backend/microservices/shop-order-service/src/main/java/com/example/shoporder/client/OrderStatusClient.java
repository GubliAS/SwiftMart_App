package com.example.shoporder.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "order-status-service", url = "${orderstatus.service.url}")
public interface OrderStatusClient {
    @GetMapping("/api/order-statuses")
    List<Object> getAllOrderStatuses();
} 