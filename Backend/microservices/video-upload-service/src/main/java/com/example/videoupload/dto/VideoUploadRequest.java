package com.example.videoupload.dto;

import lombok.Data;

@Data
public class VideoUploadRequest {
    private String description;
    private String tags;
    private Long uploadedByUserId;
    private String uploadedByEmail;
} 