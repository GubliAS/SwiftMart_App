-- Migration V4: Add seller support for multi-seller marketplace
-- This migration adds seller_id to products and order lines, plus item status tracking

-- Add seller_id to product table
ALTER TABLE product ADD COLUMN IF NOT EXISTS seller_id BIGINT;
ALTER TABLE product ADD CONSTRAINT fk_product_seller FOREIGN KEY (seller_id) REFERENCES site_user(id);

-- Add seller_id and item_status to order_line table
ALTER TABLE order_line ADD COLUMN IF NOT EXISTS seller_id BIGINT;
ALTER TABLE order_line ADD COLUMN IF NOT EXISTS item_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE order_line ADD CONSTRAINT fk_order_line_seller FOREIGN KEY (seller_id) REFERENCES site_user(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_seller_id ON product(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_line_seller_id ON order_line(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_line_item_status ON order_line(item_status);

-- Add seller role to roles table if it doesn't exist
INSERT INTO role (id, name) VALUES (2, 'SELLER') ON CONFLICT (id) DO NOTHING;

-- Update existing products to have seller_id = 1 (assuming first user is a seller)
UPDATE product SET seller_id = 1 WHERE seller_id IS NULL;

-- Update existing order lines to have seller_id = 1 and item_status = 'pending'
UPDATE order_line SET seller_id = 1, item_status = 'pending' WHERE seller_id IS NULL; 