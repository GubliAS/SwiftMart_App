package com.example.videoupload.service;

import com.example.common.exception.InvalidOperationException;
import com.example.videoupload.entity.VideoUpload;
import com.example.videoupload.repository.VideoUploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoAuthService {

    private final VideoUploadRepository videoUploadRepository;
    private final VideoSecurityService videoSecurityService;

    public boolean canAccessVideo(Long videoId, Long userId, String userEmail) {
        try {
            VideoUpload video = videoUploadRepository.findById(videoId)
                    .orElseThrow(() -> new InvalidOperationException("Video not found"));

            // Check if video is expired
            if (videoSecurityService.isFileExpired(video)) {
                log.warn("User {} tried to access expired video {}", userEmail, videoId);
                return false;
            }

            // Check if user is the owner
            if (video.getUploadedByUserId().equals(userId)) {
                return true;
            }

            // Check if user email matches
            if (video.getUploadedByEmail().equals(userEmail)) {
                return true;
            }

            // For now, allow access to all active videos
            // In a real implementation, you would check permissions, roles, etc.
            return video.isActive();

        } catch (Exception e) {
            log.error("Error checking video access for user {} on video {}: {}", userEmail, videoId, e.getMessage());
            return false;
        }
    }

    public boolean canDeleteVideo(Long videoId, Long userId) {
        try {
            VideoUpload video = videoUploadRepository.findById(videoId)
                    .orElseThrow(() -> new InvalidOperationException("Video not found"));

            // Only the owner can delete
            return video.getUploadedByUserId().equals(userId);

        } catch (Exception e) {
            log.error("Error checking delete permission for user {} on video {}: {}", userId, videoId, e.getMessage());
            return false;
        }
    }

    public boolean canUploadVideo(Long userId, String userEmail) {
        // Basic validation - in real implementation, check quotas, permissions, etc.
        if (userId == null || userEmail == null || userEmail.trim().isEmpty()) {
            return false;
        }

        // Check if user has reached upload limit
        Long uploadCount = videoUploadRepository.countByUserId(userId);
        return uploadCount < 100; // Allow max 100 videos per user
    }

    public void validateUserSession(String sessionToken) {
        // In a real implementation, validate JWT token or session
        if (sessionToken == null || sessionToken.trim().isEmpty()) {
            throw new InvalidOperationException("Invalid session token");
        }

        // For demo purposes, accept any non-empty token
        // In production, validate against auth service
        log.info("Validating session token: {}", sessionToken.substring(0, Math.min(10, sessionToken.length())));
    }
} 