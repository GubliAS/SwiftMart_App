package com.example.videoupload.service;

import com.example.common.exception.InvalidOperationException;
import com.example.videoupload.entity.VideoUpload;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
public class VideoSecurityService {

    @Value("${video.upload.max-size:5242880}")
    private long maxFileSize;

    @Value("${video.upload.allowed-extensions:mp4,avi,mov,wmv,flv,mkv,webm}")
    private String allowedExtensions;

    private final Set<String> allowedExtensionsSet = new HashSet<>();

    public void validateVideoFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidOperationException("Video file cannot be empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new InvalidOperationException(
                String.format("Video file size exceeds maximum limit of %d MB", maxFileSize / 1024 / 1024)
            );
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new InvalidOperationException("Video file name cannot be empty");
        }

        String fileExtension = getFileExtension(originalFileName);
        if (!getAllowedExtensionsSet().contains(fileExtension.toLowerCase())) {
            throw new InvalidOperationException(
                String.format("File extension '%s' is not allowed. Allowed extensions: %s",
                    fileExtension, String.join(", ", getAllowedExtensionsSet()))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new InvalidOperationException("File must be a video");
        }

        validateForMaliciousContent(file);
    }

    private void validateForMaliciousContent(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            byte[] buffer = new byte[1024];
            int bytesRead = inputStream.read(buffer);
            
            if (bytesRead > 0) {
                String content = new String(buffer, 0, bytesRead);
                
                if (content.contains("<script") || content.contains("javascript:")) {
                    throw new InvalidOperationException("File contains potentially malicious script content");
                }
            }
        } catch (IOException e) {
            throw new InvalidOperationException("Error validating file content: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private Set<String> getAllowedExtensionsSet() {
        if (allowedExtensionsSet.isEmpty()) {
            String[] extensions = allowedExtensions.split(",");
            for (String ext : extensions) {
                allowedExtensionsSet.add(ext.trim().toLowerCase());
            }
        }
        return allowedExtensionsSet;
    }

    public boolean isFileExpired(VideoUpload video) {
        return video.getUploadedAt().plusDays(30).isBefore(java.time.LocalDateTime.now());
    }

    public long getDaysUntilExpiration(VideoUpload video) {
        return java.time.Duration.between(
            java.time.LocalDateTime.now(),
            video.getUploadedAt().plusDays(30)
        ).toDays();
    }
} 