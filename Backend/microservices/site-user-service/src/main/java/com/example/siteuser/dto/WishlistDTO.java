package com.example.siteuser.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WishlistDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private LocalDateTime createdAt;
} 