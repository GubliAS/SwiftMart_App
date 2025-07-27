-- Add profile photo URL field to site_user table
ALTER TABLE site_user ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(500); 