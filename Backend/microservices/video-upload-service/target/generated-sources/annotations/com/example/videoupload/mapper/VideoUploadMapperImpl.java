package com.example.videoupload.mapper;

import com.example.videoupload.dto.VideoMetadataDTO;
import com.example.videoupload.dto.VideoUploadDTO;
import com.example.videoupload.dto.VideoUploadResponse;
import com.example.videoupload.entity.VideoUpload;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-25T11:12:48+0000",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class VideoUploadMapperImpl implements VideoUploadMapper {

    @Override
    public VideoUploadDTO toDTO(VideoUpload entity) {
        if ( entity == null ) {
            return null;
        }

        VideoUploadDTO videoUploadDTO = new VideoUploadDTO();

        videoUploadDTO.setId( entity.getId() );
        videoUploadDTO.setFileName( entity.getFileName() );
        videoUploadDTO.setOriginalFileName( entity.getOriginalFileName() );
        videoUploadDTO.setFilePath( entity.getFilePath() );
        videoUploadDTO.setFileSize( entity.getFileSize() );
        videoUploadDTO.setContentType( entity.getContentType() );
        videoUploadDTO.setFileExtension( entity.getFileExtension() );
        videoUploadDTO.setUploadedByUserId( entity.getUploadedByUserId() );
        videoUploadDTO.setUploadedByEmail( entity.getUploadedByEmail() );
        videoUploadDTO.setUploadedAt( entity.getUploadedAt() );
        videoUploadDTO.setActive( entity.isActive() );
        videoUploadDTO.setDescription( entity.getDescription() );
        videoUploadDTO.setTags( entity.getTags() );
        videoUploadDTO.setDuration( entity.getDuration() );
        videoUploadDTO.setResolution( entity.getResolution() );
        videoUploadDTO.setStatus( entity.getStatus() );

        return videoUploadDTO;
    }

    @Override
    public VideoUploadResponse toResponse(VideoUpload entity) {
        if ( entity == null ) {
            return null;
        }

        VideoUploadResponse videoUploadResponse = new VideoUploadResponse();

        videoUploadResponse.setId( entity.getId() );
        videoUploadResponse.setFileName( entity.getFileName() );
        videoUploadResponse.setOriginalFileName( entity.getOriginalFileName() );
        videoUploadResponse.setFileSize( entity.getFileSize() );
        videoUploadResponse.setContentType( entity.getContentType() );
        videoUploadResponse.setStatus( entity.getStatus() );

        return videoUploadResponse;
    }

    @Override
    public VideoMetadataDTO toMetadataDTO(VideoUpload entity) {
        if ( entity == null ) {
            return null;
        }

        VideoMetadataDTO videoMetadataDTO = new VideoMetadataDTO();

        videoMetadataDTO.setId( entity.getId() );
        videoMetadataDTO.setFileName( entity.getFileName() );
        videoMetadataDTO.setFileSize( entity.getFileSize() );
        videoMetadataDTO.setContentType( entity.getContentType() );
        videoMetadataDTO.setDuration( entity.getDuration() );
        videoMetadataDTO.setResolution( entity.getResolution() );
        videoMetadataDTO.setStatus( entity.getStatus() );
        videoMetadataDTO.setUploadedAt( entity.getUploadedAt() );
        videoMetadataDTO.setUploadedByEmail( entity.getUploadedByEmail() );

        return videoMetadataDTO;
    }

    @Override
    public VideoUpload toEntity(VideoUploadDTO dto) {
        if ( dto == null ) {
            return null;
        }

        VideoUpload videoUpload = new VideoUpload();

        videoUpload.setUploadedByUserId( dto.getUploadedByUserId() );
        videoUpload.setUploadedByEmail( dto.getUploadedByEmail() );
        videoUpload.setDescription( dto.getDescription() );
        videoUpload.setTags( dto.getTags() );

        return videoUpload;
    }
}
