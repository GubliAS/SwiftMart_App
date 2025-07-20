package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.UserReviewDTO;
import com.example.ecommerce.entity.UserReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserReviewMapper {
    @Mapping(source = "user.id", target = "userId")
    UserReviewDTO toDto(UserReview review);

    @Mapping(source = "userId", target = "user.id")
    UserReview toEntity(UserReviewDTO dto);
} 