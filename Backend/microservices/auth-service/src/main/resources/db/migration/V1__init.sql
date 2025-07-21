-- Example Flyway migration for initial schema
-- Adjust this to match your actual schema if needed
CREATE TABLE IF NOT EXISTS site_user (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    store_name VARCHAR(255),
    id_card_type VARCHAR(50),
    id_card_country VARCHAR(50),
    id_card_number VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'PENDING'
);

-- Add other tables as needed 