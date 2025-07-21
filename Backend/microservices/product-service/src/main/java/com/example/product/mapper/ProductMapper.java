package com.example.product.mapper;

import com.example.product.dto.ProductDTO;
import com.example.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toDto(Product product);

    @Mapping(source = "categoryId", target = "category.id")
    Product toEntity(ProductDTO dto);
} 