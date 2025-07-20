-- Flyway migration: Full initial schema for e-commerce app

CREATE TABLE country (
    id BIGINT PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL
);

CREATE TABLE address (
    id BIGINT PRIMARY KEY,
    unit_number VARCHAR(50),
    street_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country_id BIGINT REFERENCES country(id)
);

CREATE TABLE site_user (
    id BIGINT PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_address (
    user_id BIGINT,
    address_id BIGINT,
    is_default BOOLEAN,
    PRIMARY KEY (user_id, address_id),
    FOREIGN KEY (user_id) REFERENCES site_user(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE role (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_role (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES site_user(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE product_category (
    id BIGINT PRIMARY KEY,
    parent_category_id BIGINT,
    category_name VARCHAR(255),
    FOREIGN KEY (parent_category_id) REFERENCES product_category(id)
);

CREATE TABLE product (
    id BIGINT PRIMARY KEY,
    category_id BIGINT REFERENCES product_category(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_image VARCHAR(255)
);

CREATE TABLE variation (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE variation_option (
    id BIGINT PRIMARY KEY,
    variation_id BIGINT REFERENCES variation(id),
    value VARCHAR(255)
);

CREATE TABLE product_item (
    id BIGINT PRIMARY KEY,
    product_id BIGINT REFERENCES product(id),
    sku VARCHAR(100),
    qty_in_stock INT,
    product_image VARCHAR(255),
    price NUMERIC(12,2)
);

CREATE TABLE product_configuration (
    product_item_id BIGINT,
    variation_option_id BIGINT,
    PRIMARY KEY (product_item_id, variation_option_id),
    FOREIGN KEY (product_item_id) REFERENCES product_item(id),
    FOREIGN KEY (variation_option_id) REFERENCES variation_option(id)
);

CREATE TABLE promotion (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    discount_rate NUMERIC(5,2),
    start_date DATE,
    end_date DATE
);

CREATE TABLE promotion_category (
    category_id BIGINT,
    promotion_id BIGINT,
    PRIMARY KEY (category_id, promotion_id),
    FOREIGN KEY (category_id) REFERENCES product_category(id),
    FOREIGN KEY (promotion_id) REFERENCES promotion(id)
);

CREATE TABLE payment_type (
    id BIGINT PRIMARY KEY,
    value VARCHAR(100)
);

CREATE TABLE user_payment_method (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES site_user(id),
    payment_type_id BIGINT REFERENCES payment_type(id),
    provider VARCHAR(100),
    account_number VARCHAR(100),
    expiry_date DATE,
    is_default BOOLEAN
);

CREATE TABLE shipping_method (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC(12,2)
);

CREATE TABLE order_status (
    id BIGINT PRIMARY KEY,
    status VARCHAR(50)
);

CREATE TABLE shop_order (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES site_user(id),
    order_date TIMESTAMP,
    payment_method_id BIGINT,
    shipping_address VARCHAR(255),
    shipping_method_id BIGINT REFERENCES shipping_method(id),
    order_total NUMERIC(12,2),
    order_status VARCHAR(50)
);

CREATE TABLE order_line (
    id BIGINT PRIMARY KEY,
    product_item_id BIGINT REFERENCES product_item(id),
    order_id BIGINT REFERENCES shop_order(id),
    qty INT,
    price NUMERIC(12,2)
);

CREATE TABLE shopping_cart (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES site_user(id)
);

CREATE TABLE shopping_cart_item (
    id BIGINT PRIMARY KEY,
    cart_id BIGINT REFERENCES shopping_cart(id),
    product_item_id BIGINT REFERENCES product_item(id),
    qty INT
);

CREATE TABLE user_review (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES site_user(id),
    ordered_product_id BIGINT,
    rating_value INT,
    comment TEXT
);

CREATE TABLE order_status_history (
    id BIGINT PRIMARY KEY,
    order_id BIGINT REFERENCES shop_order(id),
    status_id BIGINT REFERENCES order_status(id),
    changed_at TIMESTAMP
); 