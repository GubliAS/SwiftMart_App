package com.example.videoupload.controller;

import com.example.videoupload.dto.VideoUploadDTO;
import com.example.videoupload.dto.VideoUploadRequest;
import com.example.videoupload.dto.VideoUploadResponse;
import com.example.videoupload.dto.VideoMetadataDTO;
import com.example.videoupload.service.VideoUploadService;
import com.example.videoupload.service.VideoAuthService;
import com.example.videoupload.service.VideoStreamingService;
import com.example.common.exception.InvalidOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VideoUploadController {

    private final VideoUploadService videoUploadService;
    private final VideoAuthService videoAuthService;
    private final VideoStreamingService videoStreamingService;

    @PostMapping("/upload")
    public ResponseEntity<VideoUploadResponse> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam("uploadedByUserId") Long uploadedByUserId,
            @RequestParam("uploadedByEmail") String uploadedByEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Validate user can upload
        if (!videoAuthService.canUploadVideo(uploadedByUserId, uploadedByEmail)) {
            throw new InvalidOperationException("User not authorized to upload videos");
        }

        VideoUploadRequest request = new VideoUploadRequest();
        request.setDescription(description);
        request.setTags(tags);
        request.setUploadedByUserId(uploadedByUserId);
        request.setUploadedByEmail(uploadedByEmail);

        VideoUploadResponse response = videoUploadService.uploadVideo(file, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoUploadDTO> getVideoById(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Check access permission
        if (!videoAuthService.canAccessVideo(id, userId, userEmail)) {
            throw new InvalidOperationException("Access denied to this video");
        }

        VideoUploadDTO video = videoUploadService.getVideoById(id);
        return ResponseEntity.ok(video);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VideoMetadataDTO>> getVideosByUserId(
            @PathVariable Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        List<VideoMetadataDTO> videos = videoUploadService.getVideosByUserId(userId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadVideo(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Check access permission
        if (!videoAuthService.canAccessVideo(id, userId, userEmail)) {
            throw new InvalidOperationException("Access denied to this video");
        }

        try {
            Path filePath = videoUploadService.getVideoFilePath(id);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .header("X-Content-Type-Options", "nosniff")
                        .header("X-Frame-Options", "DENY")
                        .header("X-XSS-Protection", "1; mode=block")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<Resource> streamVideo(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken,
            @RequestHeader(value = "Range", required = false) String rangeHeader) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Check access permission
        if (!videoAuthService.canAccessVideo(id, userId, userEmail)) {
            throw new InvalidOperationException("Access denied to this video");
        }

        // Use streaming service for proper range support
        return videoStreamingService.streamVideoWithRange(id, rangeHeader);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVideo(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Check delete permission
        if (!videoAuthService.canDeleteVideo(id, userId)) {
            throw new InvalidOperationException("You can only delete your own videos");
        }

        videoUploadService.deleteVideo(id, userId);
        return ResponseEntity.ok("Video deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<VideoMetadataDTO>> searchVideos(
            @RequestParam("q") String searchTerm,
            @RequestParam("userId") Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        List<VideoMetadataDTO> videos = videoUploadService.searchVideos(searchTerm);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}/expiration")
    public ResponseEntity<Map<String, Object>> getVideoExpirationInfo(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestParam("userEmail") String userEmail,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        // Check access permission
        if (!videoAuthService.canAccessVideo(id, userId, userEmail)) {
            throw new InvalidOperationException("Access denied to this video");
        }

        try {
            long daysUntilExpiration = videoUploadService.getDaysUntilExpiration(id);
            Map<String, Object> response = new HashMap<>();
            response.put("videoId", id);
            response.put("daysUntilExpiration", daysUntilExpiration);
            response.put("isExpired", daysUntilExpiration <= 0);
            response.put("expirationDate", java.time.LocalDateTime.now().plusDays(daysUntilExpiration));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "video-upload-service");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getServiceStats(
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        // Validate authentication
        if (authToken == null || authToken.trim().isEmpty()) {
            throw new InvalidOperationException("Authentication required");
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("maxFileSizeMB", 5);
        stats.put("allowedExtensions", "mp4,avi,mov,wmv,flv,mkv,webm");
        stats.put("retentionDays", 30);
        stats.put("service", "video-upload-service");
        stats.put("streamingSupported", true);
        stats.put("authenticationRequired", true);
        return ResponseEntity.ok(stats);
    }
} 