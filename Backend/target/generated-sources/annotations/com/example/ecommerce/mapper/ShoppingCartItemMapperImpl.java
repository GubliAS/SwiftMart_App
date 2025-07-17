package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ShoppingCartItemDTO;
import com.example.ecommerce.entity.ProductItem;
import com.example.ecommerce.entity.ShoppingCart;
import com.example.ecommerce.entity.ShoppingCartItem;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T22:29:59+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ShoppingCartItemMapperImpl implements ShoppingCartItemMapper {

    @Override
    public ShoppingCartItemDTO toDto(ShoppingCartItem item) {
        if ( item == null ) {
            return null;
        }

        ShoppingCartItemDTO shoppingCartItemDTO = new ShoppingCartItemDTO();

        shoppingCartItemDTO.setCartId( itemCartId( item ) );
        shoppingCartItemDTO.setProductItemId( itemProductItemId( item ) );
        shoppingCartItemDTO.setId( item.getId() );
        shoppingCartItemDTO.setQty( item.getQty() );

        return shoppingCartItemDTO;
    }

    @Override
    public ShoppingCartItem toEntity(ShoppingCartItemDTO dto) {
        if ( dto == null ) {
            return null;
        }

        ShoppingCartItem shoppingCartItem = new ShoppingCartItem();

        shoppingCartItem.setCart( shoppingCartItemDTOToShoppingCart( dto ) );
        shoppingCartItem.setProductItem( shoppingCartItemDTOToProductItem( dto ) );
        shoppingCartItem.setId( dto.getId() );
        shoppingCartItem.setQty( dto.getQty() );

        return shoppingCartItem;
    }

    private Long itemCartId(ShoppingCartItem shoppingCartItem) {
        if ( shoppingCartItem == null ) {
            return null;
        }
        ShoppingCart cart = shoppingCartItem.getCart();
        if ( cart == null ) {
            return null;
        }
        Long id = cart.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long itemProductItemId(ShoppingCartItem shoppingCartItem) {
        if ( shoppingCartItem == null ) {
            return null;
        }
        ProductItem productItem = shoppingCartItem.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        Long id = productItem.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected ShoppingCart shoppingCartItemDTOToShoppingCart(ShoppingCartItemDTO shoppingCartItemDTO) {
        if ( shoppingCartItemDTO == null ) {
            return null;
        }

        ShoppingCart shoppingCart = new ShoppingCart();

        shoppingCart.setId( shoppingCartItemDTO.getCartId() );

        return shoppingCart;
    }

    protected ProductItem shoppingCartItemDTOToProductItem(ShoppingCartItemDTO shoppingCartItemDTO) {
        if ( shoppingCartItemDTO == null ) {
            return null;
        }

        ProductItem productItem = new ProductItem();

        productItem.setId( shoppingCartItemDTO.getProductItemId() );

        return productItem;
    }
}
