package com.example.videoupload.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VideoUploadDTO {
    private Long id;
    private String fileName;
    private String originalFileName;
    private String filePath;
    private Long fileSize;
    private String contentType;
    private String fileExtension;
    private Long uploadedByUserId;
    private String uploadedByEmail;
    private LocalDateTime uploadedAt;
    private boolean isActive;
    private String description;
    private String tags;
    private Long duration;
    private String resolution;
    private String status;
    private String downloadUrl;
    private String streamUrl;
} 