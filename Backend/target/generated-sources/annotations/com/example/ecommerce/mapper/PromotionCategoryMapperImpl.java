package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.PromotionCategoryDTO;
import com.example.ecommerce.entity.ProductCategory;
import com.example.ecommerce.entity.Promotion;
import com.example.ecommerce.entity.PromotionCategory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:57+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PromotionCategoryMapperImpl implements PromotionCategoryMapper {

    @Override
    public PromotionCategoryDTO toDto(PromotionCategory entity) {
        if ( entity == null ) {
            return null;
        }

        PromotionCategoryDTO promotionCategoryDTO = new PromotionCategoryDTO();

        promotionCategoryDTO.setId( entity.getId() );
        promotionCategoryDTO.setCategoryId( entityCategoryId( entity ) );
        promotionCategoryDTO.setPromotionId( entityPromotionId( entity ) );

        return promotionCategoryDTO;
    }

    @Override
    public PromotionCategory toEntity(PromotionCategoryDTO dto) {
        if ( dto == null ) {
            return null;
        }

        PromotionCategory promotionCategory = new PromotionCategory();

        promotionCategory.setCategory( promotionCategoryDTOToProductCategory( dto ) );
        promotionCategory.setPromotion( promotionCategoryDTOToPromotion( dto ) );
        promotionCategory.setId( dto.getId() );

        return promotionCategory;
    }

    private Long entityCategoryId(PromotionCategory promotionCategory) {
        if ( promotionCategory == null ) {
            return null;
        }
        ProductCategory category = promotionCategory.getCategory();
        if ( category == null ) {
            return null;
        }
        Long id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long entityPromotionId(PromotionCategory promotionCategory) {
        if ( promotionCategory == null ) {
            return null;
        }
        Promotion promotion = promotionCategory.getPromotion();
        if ( promotion == null ) {
            return null;
        }
        Long id = promotion.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected ProductCategory promotionCategoryDTOToProductCategory(PromotionCategoryDTO promotionCategoryDTO) {
        if ( promotionCategoryDTO == null ) {
            return null;
        }

        ProductCategory productCategory = new ProductCategory();

        productCategory.setId( promotionCategoryDTO.getCategoryId() );

        return productCategory;
    }

    protected Promotion promotionCategoryDTOToPromotion(PromotionCategoryDTO promotionCategoryDTO) {
        if ( promotionCategoryDTO == null ) {
            return null;
        }

        Promotion promotion = new Promotion();

        promotion.setId( promotionCategoryDTO.getPromotionId() );

        return promotion;
    }
}
