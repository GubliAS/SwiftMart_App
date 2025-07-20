package com.example.videoupload.service;

import com.example.videoupload.entity.VideoUpload;
import com.example.videoupload.repository.VideoUploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoCleanupService {

    private final VideoUploadRepository videoUploadRepository;

    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2 AM
    public void cleanupExpiredVideos() {
        log.info("Starting video cleanup job...");
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<VideoUpload> expiredVideos = videoUploadRepository.findByUploadedAtBeforeAndIsActiveTrue(thirtyDaysAgo);
        
        int deletedCount = 0;
        for (VideoUpload video : expiredVideos) {
            try {
                // Delete physical file
                Path filePath = Paths.get(video.getFilePath());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    log.info("Deleted physical file: {}", video.getFileName());
                }
                
                // Mark as inactive in database
                video.setActive(false);
                videoUploadRepository.save(video);
                
                deletedCount++;
                log.info("Marked video as inactive: {}", video.getFileName());
                
            } catch (IOException e) {
                log.error("Error deleting video file: {}", video.getFileName(), e);
            }
        }
        
        log.info("Video cleanup completed. Deleted {} videos.", deletedCount);
    }

    @Scheduled(cron = "0 0 3 * * ?") // Run daily at 3 AM
    public void cleanupOrphanedFiles() {
        log.info("Starting orphaned files cleanup...");
        
        try {
            Path uploadPath = Paths.get("uploads/videos");
            if (!Files.exists(uploadPath)) {
                return;
            }
            
            Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .forEach(filePath -> {
                    String fileName = filePath.getFileName().toString();
                    if (!videoUploadRepository.existsByFileNameAndIsActiveTrue(fileName)) {
                        try {
                            Files.delete(filePath);
                            log.info("Deleted orphaned file: {}", fileName);
                        } catch (IOException e) {
                            log.error("Error deleting orphaned file: {}", fileName, e);
                        }
                    }
                });
                
        } catch (IOException e) {
            log.error("Error during orphaned files cleanup", e);
        }
    }
} 