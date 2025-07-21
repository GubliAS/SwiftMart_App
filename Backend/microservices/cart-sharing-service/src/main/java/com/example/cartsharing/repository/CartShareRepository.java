package com.example.cartsharing.repository;

import com.example.cartsharing.entity.CartShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartShareRepository extends JpaRepository<CartShare, Long> {
    Optional<CartShare> findByShareTokenAndIsActiveTrue(String shareToken);
    List<CartShare> findByCartIdAndIsActiveTrue(Long cartId);
    Optional<CartShare> findByIdAndOwnerUserId(Long id, Long ownerUserId);
    List<CartShare> findByOwnerUserIdAndIsActiveTrue(Long ownerUserId);
} 