package com.example.ecommerce.dto;

import java.math.BigDecimal;

public class OrderLineDTO {
    private Long id;
    private Long productItemId;
    private Long orderId;
    private BigDecimal price;
    private Integer qty;

    public OrderLineDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductItemId() { return productItemId; }
    public void setProductItemId(Long productItemId) { this.productItemId = productItemId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
} 