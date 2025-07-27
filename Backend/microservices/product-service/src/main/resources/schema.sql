-- Create shipping_option table if it doesn't exist
CREATE TABLE IF NOT EXISTS shipping_option (
    id SERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_shipping_option_product_id ON shipping_option(product_id);

-- Create product_variant table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_variant (
    id SERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(id) ON DELETE CASCADE,
    color VARCHAR(50),
    image VARCHAR(255),
    size VARCHAR(50),
    price NUMERIC(10,2)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_variant_product_id ON product_variant(product_id); 