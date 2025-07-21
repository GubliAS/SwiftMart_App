package com.example.userreview.mapper;

import com.example.userreview.entity.UserReview;
import com.example.userreview.dto.UserReviewDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserReviewMapper {
    UserReviewMapper INSTANCE = Mappers.getMapper(UserReviewMapper.class);

    UserReviewDTO toDto(UserReview review);
    UserReview toEntity(UserReviewDTO reviewDto);
} 