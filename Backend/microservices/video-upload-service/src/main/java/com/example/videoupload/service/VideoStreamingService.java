package com.example.videoupload.service;

import com.example.common.exception.InvalidOperationException;
import com.example.common.exception.ResourceNotFoundException;
import com.example.videoupload.entity.VideoUpload;
import com.example.videoupload.repository.VideoUploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoStreamingService {

    private final VideoUploadRepository videoUploadRepository;
    private final VideoSecurityService videoSecurityService;

    public ResponseEntity<Resource> streamVideoWithRange(Long videoId, String rangeHeader) {
        VideoUpload videoUpload = videoUploadRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found"));

        if (videoSecurityService.isFileExpired(videoUpload)) {
            throw new InvalidOperationException("Video has expired");
        }

        Path filePath = Paths.get(videoUpload.getFilePath());
        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (java.net.MalformedURLException e) {
            throw new InvalidOperationException("Invalid file path for video resource");
        }

        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("Video file not found");
        }

        try {
            long fileLength = resource.contentLength();
            
            if (rangeHeader == null || rangeHeader.isEmpty()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, videoUpload.getContentType())
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileLength))
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .header("X-Content-Type-Options", "nosniff")
                        .body(resource);
            }

            List<HttpRange> ranges = HttpRange.parseRanges(rangeHeader);
            if (ranges.size() > 1) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                        .header(HttpHeaders.CONTENT_RANGE, "bytes */" + fileLength)
                        .build();
            }

            HttpRange range = ranges.get(0);
            long start = range.getRangeStart(fileLength);
            long end = range.getRangeEnd(fileLength);
            long rangeLength = end - start + 1;

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .header(HttpHeaders.CONTENT_TYPE, videoUpload.getContentType())
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(rangeLength))
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header("X-Content-Type-Options", "nosniff")
                    .body(resource);

        } catch (IOException e) {
            throw new InvalidOperationException("Error streaming video");
        }
    }

    public ResponseEntity<Resource> getVideoThumbnail(Long videoId) {
        VideoUpload videoUpload = videoUploadRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        // Check if video is expired
        if (videoSecurityService.isFileExpired(videoUpload)) {
            throw new InvalidOperationException("Video has expired and is no longer available");
        }

        // For now, return a placeholder or generate thumbnail
        // In a real implementation, you would generate thumbnails using FFmpeg
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png")
                .header("X-Content-Type-Options", "nosniff")
                .header("X-Frame-Options", "SAMEORIGIN")
                .build();
    }

    public ResponseEntity<Resource> getVideoMetadata(Long videoId) {
        VideoUpload videoUpload = videoUploadRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        // Check if video is expired
        if (videoSecurityService.isFileExpired(videoUpload)) {
            throw new InvalidOperationException("Video has expired and is no longer available");
        }

        Path filePath = Paths.get(videoUpload.getFilePath());
        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (java.net.MalformedURLException e) {
            throw new InvalidOperationException("Invalid file path for video resource");
        }

        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("Video file not found");
        }

        try {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .header("X-Content-Type-Options", "nosniff")
                    .header("X-Frame-Options", "DENY")
                    .header("X-XSS-Protection", "1; mode=block")
                    .body(resource);
        } catch (Exception e) {
            log.error("Error getting video metadata: {}", e.getMessage());
            throw new InvalidOperationException("Error getting video metadata");
        }
    }
} 