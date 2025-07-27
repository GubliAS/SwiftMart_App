-- Insert sample shipping options for products
-- Using ON CONFLICT DO NOTHING to prevent duplicate key violations

-- Product 1: Standard and Express shipping
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(1, 'Standard', '5-10 days', 0.00),
(1, 'Express', '2-5 days', 9.99)
ON CONFLICT (product_id, type) DO NOTHING;

-- Product 2: Standard and Express shipping
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(2, 'Standard', '5-10 days', 0.00),
(2, 'Express', '2-5 days', 9.99)
ON CONFLICT (product_id, type) DO NOTHING;

-- Product 3: Standard shipping only
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(3, 'Standard', '3-7 days', 0.00)
ON CONFLICT (product_id, type) DO NOTHING;

-- Product 4: Standard and Express shipping
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(4, 'Standard', '5-10 days', 0.00),
(4, 'Express', '2-5 days', 9.99)
ON CONFLICT (product_id, type) DO NOTHING;

-- Product 5: Standard and Express shipping
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(5, 'Standard', '5-10 days', 0.00),
(5, 'Express', '2-5 days', 9.99)
ON CONFLICT (product_id, type) DO NOTHING;

-- Product 8: Standard and Express shipping for Hair Dryer (test product)
INSERT INTO shipping_option (product_id, type, duration, price) VALUES 
(8, 'Standard', '5-10 days', 0.00),
(8, 'Express', '2-5 days', 9.99)
ON CONFLICT (product_id, type) DO NOTHING;

-- Insert sample product variants for products that need color/size options
-- Using ON CONFLICT DO NOTHING to prevent duplicate key violations

-- Product 1: Smartphone Pro X15 - Color and Storage variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(1, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/smartphone.jpg', '256GB', 1200.99),
(1, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/smartphone.jpg', '512GB', 1400.99),
(1, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/smartphone.jpg', '256GB', 1200.99),
(1, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/smartphone.jpg', '512GB', 1400.99)
ON CONFLICT (product_id, color, size) DO NOTHING;

-- Product 2: UltraBook 14 Pro - Color variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(2, 'Gray', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/laptop.jpeg', '14-inch', 999.99),
(2, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/laptop.jpeg', '14-inch', 999.99)
ON CONFLICT (product_id, color, size) DO NOTHING;

-- Product 11: Sofa - Color and Size variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(11, 'Gray', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sofa.jpeg', '2-seater', 399.99),
(11, 'Gray', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sofa.jpeg', '3-seater', 499.99),
(11, 'Beige', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sofa.jpeg', '2-seater', 399.99),
(11, 'Beige', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sofa.jpeg', '3-seater', 499.99)
ON CONFLICT (product_id, color, size) DO NOTHING;

-- Product 13: Leather Jacket - Color and Size variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(13, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'S', 149.99),
(13, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'M', 149.99),
(13, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'L', 149.99),
(13, 'Black', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'XL', 149.99),
(13, 'Brown', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'S', 149.99),
(13, 'Brown', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'M', 149.99),
(13, 'Brown', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'L', 149.99),
(13, 'Brown', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/leatherjacket.jpeg', 'XL', 149.99)
ON CONFLICT (product_id, color, size) DO NOTHING;

-- Product 14: Sneakers - Color and Size variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(14, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '7', 99.99),
(14, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '8', 99.99),
(14, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '9', 99.99),
(14, 'White', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '10', 99.99),
(14, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '7', 99.99),
(14, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '8', 99.99),
(14, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '9', 99.99),
(14, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/sneakers.jpeg', '10', 99.99)
ON CONFLICT (product_id, color, size) DO NOTHING;

-- Product 23: Classic Blue Jeans - Color and Size variants
INSERT INTO product_variant (product_id, color, image, size, price) VALUES 
(23, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/jeans.jpg', '30', 59.99),
(23, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/jeans.jpg', '32', 59.99),
(23, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/jeans.jpg', '34', 59.99),
(23, 'Blue', 'https://res.cloudinary.com/dnbthgvlh/image/upload/v1753457541/swiftmart_products/jeans.jpg', '36', 59.99)
ON CONFLICT (product_id, color, size) DO NOTHING; 