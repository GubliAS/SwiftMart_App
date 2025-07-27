package com.example.product.mapper;

import com.example.product.dto.ProductDTO;
import com.example.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ShippingOptionMapper.class})
public interface ProductMapper {
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "seller.id", target = "sellerId")
    ProductDTO toDto(Product product);

    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "sellerId", target = "seller.id")
    Product toEntity(ProductDTO dto);
} 