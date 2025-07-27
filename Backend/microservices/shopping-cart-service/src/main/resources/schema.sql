-- Drop tables if they exist
DROP TABLE IF EXISTS shopping_cart_item;
DROP TABLE IF EXISTS shopping_cart_invited_emails;
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS product_item;

-- Create product_item table
CREATE TABLE product_item (
    id BIGINT PRIMARY KEY
);

-- Create shopping_cart table
CREATE TABLE shopping_cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create shopping_cart_invited_emails table
CREATE TABLE shopping_cart_invited_emails (
    shopping_cart_id BIGINT,
    invited_emails VARCHAR(255),
    FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart(id)
);

-- Create shopping_cart_item table
CREATE TABLE shopping_cart_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT,
    product_item_id BIGINT,
    size VARCHAR(255),
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(id),
    FOREIGN KEY (product_item_id) REFERENCES product_item(id)
); 