package com.example.videoupload.repository;

import com.example.videoupload.entity.VideoUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VideoUploadRepository extends JpaRepository<VideoUpload, Long> {
    
    List<VideoUpload> findByUploadedByUserIdAndIsActiveTrue(Long userId);
    
    List<VideoUpload> findByUploadedByEmailAndIsActiveTrue(String email);
    
    Optional<VideoUpload> findByFileNameAndIsActiveTrue(String fileName);
    
    boolean existsByFileNameAndIsActiveTrue(String fileName);
    
    List<VideoUpload> findByUploadedAtBeforeAndIsActiveTrue(LocalDateTime dateTime);
    
    @Query("SELECT v FROM VideoUpload v WHERE v.isActive = true AND " +
           "(LOWER(v.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.tags) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.originalFileName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<VideoUpload> searchVideos(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT v FROM VideoUpload v WHERE v.isActive = true AND v.fileSize <= :maxSize")
    List<VideoUpload> findByFileSizeLessThanEqual(@Param("maxSize") Long maxSize);
    
    @Query("SELECT v FROM VideoUpload v WHERE v.isActive = true AND v.contentType LIKE 'video/%'")
    List<VideoUpload> findAllVideoFiles();
    
    @Query("SELECT COUNT(v) FROM VideoUpload v WHERE v.uploadedByUserId = :userId AND v.isActive = true")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT v FROM VideoUpload v WHERE v.isActive = true AND v.uploadedAt < :expiryDate")
    List<VideoUpload> findExpiredVideos(@Param("expiryDate") LocalDateTime expiryDate);
} 