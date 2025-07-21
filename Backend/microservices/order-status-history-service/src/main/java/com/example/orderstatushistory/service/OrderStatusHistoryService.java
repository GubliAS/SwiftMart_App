package com.example.orderstatushistory.service;

import com.example.orderstatushistory.dto.OrderStatusHistoryDTO;
import com.example.orderstatushistory.mapper.OrderStatusHistoryMapper;
import com.example.orderstatushistory.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderStatusHistoryService {
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;

    public List<OrderStatusHistoryDTO> getOrderStatusHistory(Long orderId) {
        return orderStatusHistoryRepository.findByOrderIdOrderByChangedAtAsc(orderId).stream()
                .map(orderStatusHistoryMapper::toDto)
                .collect(Collectors.toList());
    }
} 