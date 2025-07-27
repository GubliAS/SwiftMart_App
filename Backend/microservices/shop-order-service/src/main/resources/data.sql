-- Insert test product items for order service testing
INSERT INTO product_item (id, price, qty_in_stock) VALUES 
(1, 149.99, 10),
(2, 149.99, 15),
(3, 99.99, 20),
(4, 99.99, 12),
(5, 199.99, 8)
ON CONFLICT (id) DO NOTHING; 