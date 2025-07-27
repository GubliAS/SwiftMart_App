CREATE TABLE IF NOT EXISTS verification_code (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL
); 