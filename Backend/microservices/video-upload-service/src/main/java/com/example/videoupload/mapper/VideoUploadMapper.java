package com.example.videoupload.mapper;

import com.example.videoupload.dto.VideoUploadDTO;
import com.example.videoupload.dto.VideoUploadResponse;
import com.example.videoupload.dto.VideoMetadataDTO;
import com.example.videoupload.entity.VideoUpload;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface VideoUploadMapper {
    VideoUploadMapper INSTANCE = Mappers.getMapper(VideoUploadMapper.class);

    VideoUploadDTO toDTO(VideoUpload entity);
    
    VideoUploadResponse toResponse(VideoUpload entity);
    
    VideoMetadataDTO toMetadataDTO(VideoUpload entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fileName", ignore = true)
    @Mapping(target = "originalFileName", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "contentType", ignore = true)
    @Mapping(target = "fileExtension", ignore = true)
    @Mapping(target = "uploadedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "duration", ignore = true)
    @Mapping(target = "resolution", ignore = true)
    @Mapping(target = "status", ignore = true)
    VideoUpload toEntity(VideoUploadDTO dto);
} 