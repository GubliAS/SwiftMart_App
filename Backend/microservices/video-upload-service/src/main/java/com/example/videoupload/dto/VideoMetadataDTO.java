package com.example.videoupload.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VideoMetadataDTO {
    private Long id;
    private String fileName;
    private Long fileSize;
    private String contentType;
    private Long duration;
    private String resolution;
    private String status;
    private LocalDateTime uploadedAt;
    private String uploadedByEmail;
} 