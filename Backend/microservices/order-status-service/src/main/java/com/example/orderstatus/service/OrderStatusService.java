package com.example.orderstatus.service;

import com.example.orderstatus.dto.OrderStatusDTO;
import com.example.orderstatus.entity.OrderStatus;
import com.example.orderstatus.mapper.OrderStatusMapper;
import com.example.orderstatus.repository.OrderStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderStatusService {
    private final OrderStatusRepository orderStatusRepository;
    private final OrderStatusMapper orderStatusMapper;

    public OrderStatusDTO addOrderStatus(OrderStatusDTO dto) {
        OrderStatus entity = orderStatusMapper.toEntity(dto);
        return orderStatusMapper.toDto(orderStatusRepository.save(entity));
    }

    public OrderStatusDTO updateOrderStatus(OrderStatusDTO dto) {
        OrderStatus entity = orderStatusRepository.findById(dto.getId()).orElseThrow();
        entity.setStatus(dto.getStatus());
        return orderStatusMapper.toDto(orderStatusRepository.save(entity));
    }

    public void deleteOrderStatus(Long id) {
        orderStatusRepository.deleteById(id);
    }

    public List<OrderStatusDTO> getAllOrderStatuses() {
        return orderStatusRepository.findAll().stream()
                .map(orderStatusMapper::toDto)
                .collect(Collectors.toList());
    }
} 