# Database Schema

## Tables

### `products`
*   `id` (uuid, PK)
*   `name` (text)
*   `category` (text) - e.g., 'iron', 'curd_pot'
*   `description` (text)
*   `price` (int)
*   `image_url` (text)
*   `available_locations` (text[]) - e.g., ['India', 'UAE']
*   `metadata` (jsonb) - for dimensions, weight, etc.

### `orders`
*   `id` (uuid, PK)
*   `user_phone` (text)
*   `status` (text) - 'pending', 'shipped', 'delivered'
*   `items` (jsonb)
*   `created_at` (timestamp)

### `users`
*   `phone` (text, PK)
*   `name` (text)
*   `location` (text)
*   `last_active` (timestamp)
