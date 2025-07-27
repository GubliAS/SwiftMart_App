-- Sample reviews for product 8 (Hair Dryer)
-- First, remove any existing reviews for product 8 to avoid duplicates
DELETE FROM user_review WHERE product_id = 8;
INSERT INTO user_review (product_id, user_id, rating_value, comment, date) VALUES
(8, 1, 5, 'Excellent hair dryer, dries quickly and quietly!', '2024-07-01'),
(8, 1, 4, 'Works well, but a bit heavy.', '2024-07-02'),
(8, 1, 3, 'Average performance, expected more.', '2024-07-03'); 