package com.example.cartsharing.repository;

import com.example.cartsharing.entity.CartInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartInvitationRepository extends JpaRepository<CartInvitation, Long> {
    List<CartInvitation> findByInviteeEmailAndIsActiveTrueAndIsAcceptedFalse(String inviteeEmail);
    List<CartInvitation> findByCartIdAndIsActiveTrue(Long cartId);
    List<CartInvitation> findByInviterUserIdAndIsActiveTrue(Long inviterUserId);
} 