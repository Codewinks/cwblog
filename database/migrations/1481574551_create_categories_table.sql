CREATE TABLE `categories` (
  `id` char(36) PRIMARY KEY,
  `name` varchar(250) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `description` text NULL DEFAULT NULL,
  `parent_category_id` char(36) NULL DEFAULT NULL,
  `visibility` varchar(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `categories_slug_unique` (`slug`, `parent_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;