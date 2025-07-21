package com.example.cartsharing.service;

import com.example.cartsharing.dto.*;
import com.example.cartsharing.entity.CartShare;
import com.example.cartsharing.entity.CartInvitation;
import com.example.cartsharing.repository.CartShareRepository;
import com.example.cartsharing.repository.CartInvitationRepository;
import com.example.cartsharing.client.EmailClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartSharingService {
    
    private final CartShareRepository cartShareRepository;
    private final CartInvitationRepository cartInvitationRepository;
    private final EmailClient emailClient;

    public CartShareDTO createShare(CreateShareRequest request, Long ownerUserId, String ownerEmail) {
        log.info("Creating cart share for cart: {} by user: {}", request.getCartId(), ownerUserId);
        
        CartShare cartShare = new CartShare();
        cartShare.setCartId(request.getCartId());
        cartShare.setOwnerUserId(ownerUserId);
        cartShare.setOwnerEmail(ownerEmail);
        cartShare.setPermission(CartShare.SharePermission.valueOf(request.getPermission()));
        
        if (request.getExpiryDays() != null) {
            cartShare.setExpiresAt(LocalDateTime.now().plusDays(request.getExpiryDays()));
        }
        
        CartShare savedShare = cartShareRepository.save(cartShare);
        return convertToDTO(savedShare);
    }

    public CartInvitationDTO inviteUser(InviteUserRequest request, Long inviterUserId, String inviterEmail) {
        log.info("Inviting user: {} to cart: {} by user: {}", request.getInviteeEmail(), request.getCartId(), inviterUserId);
        
        CartInvitation invitation = new CartInvitation();
        invitation.setCartId(request.getCartId());
        invitation.setInviterUserId(inviterUserId);
        invitation.setInviterEmail(inviterEmail);
        invitation.setInviteeEmail(request.getInviteeEmail());
        invitation.setPermission(CartShare.SharePermission.valueOf(request.getPermission()));
        
        CartInvitation savedInvitation = cartInvitationRepository.save(invitation);
        
        // Send invitation email
        sendInvitationEmail(savedInvitation, request.getMessage());
        
        return convertToDTO(savedInvitation);
    }

    public CartShareDTO getShareByToken(String shareToken) {
        log.info("Getting share by token: {}", shareToken);
        
        Optional<CartShare> cartShare = cartShareRepository.findByShareTokenAndIsActiveTrue(shareToken);
        if (cartShare.isPresent() && cartShare.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            return convertToDTO(cartShare.get());
        }
        return null;
    }

    public List<CartInvitationDTO> getInvitationsForUser(String userEmail) {
        log.info("Getting invitations for user: {}", userEmail);
        
        List<CartInvitation> invitations = cartInvitationRepository.findByInviteeEmailAndIsActiveTrueAndIsAcceptedFalse(userEmail);
        return invitations.stream()
                .filter(inv -> inv.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean acceptInvitation(AcceptInvitationRequest request) {
        log.info("Accepting invitation: {} by user: {}", request.getInvitationId(), request.getUserId());
        
        Optional<CartInvitation> invitation = cartInvitationRepository.findById(request.getInvitationId());
        if (invitation.isPresent() && invitation.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            CartInvitation inv = invitation.get();
            inv.setAccepted(true);
            cartInvitationRepository.save(inv);
            return true;
        }
        return false;
    }

    public void revokeShare(Long shareId, Long ownerUserId) {
        log.info("Revoking share: {} by owner: {}", shareId, ownerUserId);
        
        Optional<CartShare> share = cartShareRepository.findByIdAndOwnerUserId(shareId, ownerUserId);
        if (share.isPresent()) {
            CartShare cartShare = share.get();
            cartShare.setActive(false);
            cartShareRepository.save(cartShare);
        }
    }

    private void sendInvitationEmail(CartInvitation invitation, String message) {
        try {
            EmailClient.EmailRequest emailRequest = new EmailClient.EmailRequest();
            emailRequest.setTo(invitation.getInviteeEmail());
            emailRequest.setSubject("You've been invited to view a shopping cart");
            
            String emailText = String.format(
                "Hello!\n\n" +
                "You've been invited by %s to view their shopping cart.\n\n" +
                "Permission: %s\n\n" +
                "%s\n\n" +
                "Click here to accept the invitation: [LINK]\n\n" +
                "This invitation expires on: %s\n\n" +
                "Best regards,\nYour Shopping App",
                invitation.getInviterEmail(),
                invitation.getPermission(),
                message != null ? "Message: " + message : "",
                invitation.getExpiresAt()
            );
            
            emailRequest.setText(emailText);
            emailClient.sendEmail(emailRequest);
            
            log.info("Invitation email sent to: {}", invitation.getInviteeEmail());
        } catch (Exception e) {
            log.error("Failed to send invitation email", e);
        }
    }

    private CartShareDTO convertToDTO(CartShare cartShare) {
        CartShareDTO dto = new CartShareDTO();
        dto.setId(cartShare.getId());
        dto.setShareToken(cartShare.getShareToken());
        dto.setCartId(cartShare.getCartId());
        dto.setOwnerUserId(cartShare.getOwnerUserId());
        dto.setOwnerEmail(cartShare.getOwnerEmail());
        dto.setPermission(cartShare.getPermission().name());
        dto.setCreatedAt(cartShare.getCreatedAt());
        dto.setExpiresAt(cartShare.getExpiresAt());
        dto.setActive(cartShare.isActive());
        dto.setShareUrl("http://localhost:3000/cart/share/" + cartShare.getShareToken());
        return dto;
    }

    private CartInvitationDTO convertToDTO(CartInvitation invitation) {
        CartInvitationDTO dto = new CartInvitationDTO();
        dto.setId(invitation.getId());
        dto.setCartId(invitation.getCartId());
        dto.setInviterUserId(invitation.getInviterUserId());
        dto.setInviterEmail(invitation.getInviterEmail());
        dto.setInviteeEmail(invitation.getInviteeEmail());
        dto.setPermission(invitation.getPermission().name());
        dto.setInvitedAt(invitation.getInvitedAt());
        dto.setExpiresAt(invitation.getExpiresAt());
        dto.setAccepted(invitation.isAccepted());
        dto.setActive(invitation.isActive());
        return dto;
    }
} 