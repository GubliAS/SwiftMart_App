package com.example.videoupload.dto;

import lombok.Data;

@Data
public class VideoUploadResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private Long fileSize;
    private String contentType;
    private String status;
    private String downloadUrl;
    private String streamUrl;
    private String message;
} 