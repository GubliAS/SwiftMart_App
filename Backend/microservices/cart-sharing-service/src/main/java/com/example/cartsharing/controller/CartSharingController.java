package com.example.cartsharing.controller;

import com.example.cartsharing.dto.*;
import com.example.cartsharing.service.CartSharingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;

import java.util.List;

@RestController
@RequestMapping("/api/cart-sharing")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CartSharingController {
    
    private final CartSharingService cartSharingService;

    @PostMapping("/share")
    public ResponseEntity<?> createShare(
            @RequestBody CreateShareRequest request,
            @RequestParam Long userId,
            @RequestParam String userEmail) {
        try {
            CartShareDTO share = cartSharingService.createShare(request, userId, userEmail);
            return ResponseEntity.ok(share);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to create share: " + e.getMessage()));
        }
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(
            @RequestBody InviteUserRequest request,
            @RequestParam Long inviterUserId,
            @RequestParam String inviterEmail) {
        try {
            CartInvitationDTO invitation = cartSharingService.inviteUser(request, inviterUserId, inviterEmail);
            return ResponseEntity.ok(invitation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to invite user: " + e.getMessage()));
        }
    }

    @GetMapping("/share/{shareToken}")
    public ResponseEntity<?> getShareByToken(@PathVariable String shareToken) {
        CartShareDTO share = cartSharingService.getShareByToken(shareToken);
        if (share != null) {
            return ResponseEntity.ok(share);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<CartInvitationDTO>> getInvitationsForUser(@RequestParam String userEmail) {
        List<CartInvitationDTO> invitations = cartSharingService.getInvitationsForUser(userEmail);
        return ResponseEntity.ok(invitations);
    }

    @PostMapping("/invitations/accept")
    public ResponseEntity<?> acceptInvitation(@RequestBody AcceptInvitationRequest request) {
        boolean accepted = cartSharingService.acceptInvitation(request);
        if (accepted) {
            return ResponseEntity.ok("Invitation accepted successfully");
        } else {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to accept invitation"));
        }
    }

    @DeleteMapping("/share/{shareId}")
    public ResponseEntity<?> revokeShare(
            @PathVariable Long shareId,
            @RequestParam Long ownerUserId) {
        try {
            cartSharingService.revokeShare(shareId, ownerUserId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to revoke share: " + e.getMessage()));
        }
    }

    @Data
    public static class ErrorResponse {
        private final String error;
    }
} 