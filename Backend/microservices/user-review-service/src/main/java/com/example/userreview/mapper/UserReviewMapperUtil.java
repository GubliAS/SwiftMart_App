package com.example.userreview.mapper;

import com.example.commonentities.SiteUser;
import org.mapstruct.Named;

public class UserReviewMapperUtil {
    @Named("userToId")
    public static Long userToId(SiteUser user) {
        return user != null ? user.getId() : null;
    }

    @Named("idToUser")
    public static SiteUser idToUser(Long id) {
        if (id == null) return null;
        SiteUser user = new SiteUser();
        user.setId(id);
        return user;
    }
} 