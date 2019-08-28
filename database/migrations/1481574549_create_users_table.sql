CREATE TABLE `users` (
  `id` char(36) PRIMARY KEY,
  `first_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `nickname` varchar(250) NULL DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(250) DEFAULT NULL,
  `timezone` varchar(100) NULL DEFAULT 'UTC',
  `role` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;