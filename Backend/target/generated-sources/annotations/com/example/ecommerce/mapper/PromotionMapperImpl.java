package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.PromotionDTO;
import com.example.ecommerce.entity.Promotion;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:30:01+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PromotionMapperImpl implements PromotionMapper {

    @Override
    public PromotionDTO toDto(Promotion promotion) {
        if ( promotion == null ) {
            return null;
        }

        PromotionDTO promotionDTO = new PromotionDTO();

        promotionDTO.setDescription( promotion.getDescription() );
        promotionDTO.setDiscountRate( promotion.getDiscountRate() );
        promotionDTO.setEndDate( promotion.getEndDate() );
        promotionDTO.setId( promotion.getId() );
        promotionDTO.setName( promotion.getName() );
        promotionDTO.setStartDate( promotion.getStartDate() );

        return promotionDTO;
    }

    @Override
    public Promotion toEntity(PromotionDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Promotion promotion = new Promotion();

        promotion.setDescription( dto.getDescription() );
        promotion.setDiscountRate( dto.getDiscountRate() );
        promotion.setEndDate( dto.getEndDate() );
        promotion.setId( dto.getId() );
        promotion.setName( dto.getName() );
        promotion.setStartDate( dto.getStartDate() );

        return promotion;
    }
}
