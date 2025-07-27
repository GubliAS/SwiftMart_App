package com.example.shoppingcart.dto;

import java.util.List;

public class MergeCartRequest {
    private String userEmail;
    private List<GuestCartDTO> guestCarts;

    // Getters and setters
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<GuestCartDTO> getGuestCarts() {
        return guestCarts;
    }

    public void setGuestCarts(List<GuestCartDTO> guestCarts) {
        this.guestCarts = guestCarts;
    }

    // Inner class for GuestCartDTO
    public static class GuestCartDTO {
        private String name;
        private List<GuestCartItemDTO> items;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<GuestCartItemDTO> getItems() {
            return items;
        }

        public void setItems(List<GuestCartItemDTO> items) {
            this.items = items;
        }
    }

    // Inner class for GuestCartItemDTO
    public static class GuestCartItemDTO {
        private Long productItemId;
        private Integer quantity;
        private String size;

        // Getters and setters
        public Long getProductItemId() {
            return productItemId;
        }

        public void setProductItemId(Long productItemId) {
            this.productItemId = productItemId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }
    }
}