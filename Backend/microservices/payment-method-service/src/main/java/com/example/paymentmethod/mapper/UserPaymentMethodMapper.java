package com.example.paymentmethod.mapper;

import com.example.paymentmethod.dto.UserPaymentMethodDTO;
import com.example.paymentmethod.entity.UserPaymentMethod;
import com.example.commonentities.SiteUser;
import com.example.paymentmethod.entity.PaymentType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserPaymentMethodMapper {
    @Mapping(source = "user", target = "userId", qualifiedByName = "userToId")
    @Mapping(source = "paymentType", target = "paymentTypeId", qualifiedByName = "paymentTypeToId")
    UserPaymentMethodDTO toDto(UserPaymentMethod entity);

    @Mapping(target = "user", source = "userId", qualifiedByName = "idToUser")
    @Mapping(target = "paymentType", source = "paymentTypeId", qualifiedByName = "idToPaymentType")
    UserPaymentMethod toEntity(UserPaymentMethodDTO dto);

    @Named("userToId")
    static Long userToId(SiteUser user) {
        return user != null ? user.getId() : null;
    }

    @Named("paymentTypeToId")
    static Long paymentTypeToId(PaymentType paymentType) {
        return paymentType != null ? paymentType.getId() : null;
    }

    @Named("idToUser")
    static SiteUser idToUser(Long id) {
        if (id == null) return null;
        SiteUser user = new SiteUser();
        user.setId(id);
        return user;
    }

    @Named("idToPaymentType")
    static PaymentType idToPaymentType(Long id) {
        if (id == null) return null;
        PaymentType paymentType = new PaymentType();
        paymentType.setId(id);
        return paymentType;
    }
} 