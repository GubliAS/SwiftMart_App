package com.example.videoupload.service;

import com.example.videoupload.dto.VideoUploadDTO;
import com.example.videoupload.dto.VideoUploadRequest;
import com.example.videoupload.dto.VideoUploadResponse;
import com.example.videoupload.dto.VideoMetadataDTO;
import com.example.videoupload.entity.VideoUpload;
import com.example.videoupload.mapper.VideoUploadMapper;
import com.example.videoupload.repository.VideoUploadRepository;
import com.example.common.exception.ResourceNotFoundException;
import com.example.common.exception.InvalidOperationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoUploadService {

    private final VideoUploadRepository videoUploadRepository;
    private final VideoUploadMapper videoUploadMapper;
    private final VideoSecurityService videoSecurityService;

    @Value("${video.upload.max-size:5242880}") // 5MB in bytes
    private long maxFileSize;

    @Value("${video.upload.directory:uploads/videos}")
    private String uploadDirectory;

    @Value("${video.upload.allowed-extensions:mp4,avi,mov,wmv,flv,mkv,webm}")
    private String allowedExtensions;

    public VideoUploadResponse uploadVideo(MultipartFile file, VideoUploadRequest request) {
        try {
            // Use security service for validation
            videoSecurityService.validateVideoFile(file);
            
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            VideoUpload videoUpload = new VideoUpload();
            videoUpload.setFileName(uniqueFileName);
            videoUpload.setOriginalFileName(originalFileName);
            videoUpload.setFilePath(filePath.toString());
            videoUpload.setFileSize(file.getSize());
            videoUpload.setContentType(file.getContentType());
            videoUpload.setFileExtension(fileExtension);
            videoUpload.setUploadedByUserId(request.getUploadedByUserId());
            videoUpload.setUploadedByEmail(request.getUploadedByEmail());
            videoUpload.setDescription(request.getDescription());
            videoUpload.setTags(request.getTags());
            videoUpload.setStatus("UPLOADED");

            VideoUpload savedVideo = videoUploadRepository.save(videoUpload);

            VideoUploadResponse response = videoUploadMapper.toResponse(savedVideo);
            response.setDownloadUrl("/api/videos/" + savedVideo.getId() + "/download");
            response.setStreamUrl("/api/videos/" + savedVideo.getId() + "/stream");
            response.setMessage("Video uploaded successfully");

            log.info("Video uploaded successfully: {} by user: {}", savedVideo.getFileName(), request.getUploadedByEmail());
            return response;

        } catch (IOException e) {
            log.error("Error uploading video: {}", e.getMessage());
            throw new InvalidOperationException("Failed to upload video: " + e.getMessage());
        }
    }

    public VideoUploadDTO getVideoById(Long id) {
        VideoUpload videoUpload = videoUploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));
        
        // Check if video is expired
        if (videoSecurityService.isFileExpired(videoUpload)) {
            throw new InvalidOperationException("Video has expired and is no longer available");
        }
        
        VideoUploadDTO dto = videoUploadMapper.toDTO(videoUpload);
        dto.setDownloadUrl("/api/videos/" + id + "/download");
        dto.setStreamUrl("/api/videos/" + id + "/stream");
        return dto;
    }

    public List<VideoMetadataDTO> getVideosByUserId(Long userId) {
        List<VideoUpload> videos = videoUploadRepository.findByUploadedByUserIdAndIsActiveTrue(userId);
        return videos.stream()
                .filter(video -> !videoSecurityService.isFileExpired(video))
                .map(videoUploadMapper::toMetadataDTO)
                .collect(Collectors.toList());
    }

    public List<VideoMetadataDTO> searchVideos(String searchTerm) {
        List<VideoUpload> videos = videoUploadRepository.searchVideos(searchTerm);
        return videos.stream()
                .filter(video -> !videoSecurityService.isFileExpired(video))
                .map(videoUploadMapper::toMetadataDTO)
                .collect(Collectors.toList());
    }

    public void deleteVideo(Long id, Long userId) {
        VideoUpload videoUpload = videoUploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));

        if (!videoUpload.getUploadedByUserId().equals(userId)) {
            throw new InvalidOperationException("You can only delete your own videos");
        }

        // Mark as inactive instead of deleting
        videoUpload.setActive(false);
        videoUploadRepository.save(videoUpload);

        // Delete the actual file
        try {
            Path filePath = Paths.get(videoUpload.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Deleted video file: {}", videoUpload.getFileName());
            }
        } catch (IOException e) {
            log.warn("Could not delete video file: {}", e.getMessage());
        }

        log.info("Video deleted by user: {}", userId);
    }

    public Path getVideoFilePath(Long id) {
        VideoUpload videoUpload = videoUploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));
        
        // Check if video is expired
        if (videoSecurityService.isFileExpired(videoUpload)) {
            throw new InvalidOperationException("Video has expired and is no longer available");
        }
        
        return Paths.get(videoUpload.getFilePath());
    }

    public long getDaysUntilExpiration(Long videoId) {
        VideoUpload videoUpload = videoUploadRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));
        
        return videoSecurityService.getDaysUntilExpiration(videoUpload);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private boolean isAllowedExtension(String extension) {
        String[] allowed = allowedExtensions.split(",");
        for (String allowedExt : allowed) {
            if (allowedExt.trim().equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }
} 