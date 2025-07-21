package com.example.siteuser.mapper;

import com.example.commonentities.Wishlist;
import com.example.siteuser.dto.WishlistDTO;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-20T18:44:50+0000",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class WishlistMapperImpl implements WishlistMapper {

    @Override
    public WishlistDTO toDto(Wishlist wishlist) {
        if ( wishlist == null ) {
            return null;
        }

        WishlistDTO wishlistDTO = new WishlistDTO();

        wishlistDTO.setId( wishlist.getId() );
        wishlistDTO.setCreatedAt( wishlist.getCreatedAt() );

        return wishlistDTO;
    }

    @Override
    public Wishlist toEntity(WishlistDTO wishlistDto) {
        if ( wishlistDto == null ) {
            return null;
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setId( wishlistDto.getId() );
        wishlist.setCreatedAt( wishlistDto.getCreatedAt() );

        return wishlist;
    }
}
