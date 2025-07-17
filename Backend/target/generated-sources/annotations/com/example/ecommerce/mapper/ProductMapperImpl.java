package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductCategory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:58+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductDTO toDto(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setCategoryId( productCategoryId( product ) );
        productDTO.setDescription( product.getDescription() );
        productDTO.setId( product.getId() );
        productDTO.setName( product.getName() );
        productDTO.setProductImage( product.getProductImage() );

        return productDTO;
    }

    @Override
    public Product toEntity(ProductDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Product product = new Product();

        product.setCategory( productDTOToProductCategory( dto ) );
        product.setDescription( dto.getDescription() );
        product.setId( dto.getId() );
        product.setName( dto.getName() );
        product.setProductImage( dto.getProductImage() );

        return product;
    }

    private Long productCategoryId(Product product) {
        if ( product == null ) {
            return null;
        }
        ProductCategory category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        Long id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected ProductCategory productDTOToProductCategory(ProductDTO productDTO) {
        if ( productDTO == null ) {
            return null;
        }

        ProductCategory productCategory = new ProductCategory();

        productCategory.setId( productDTO.getCategoryId() );

        return productCategory;
    }
}
