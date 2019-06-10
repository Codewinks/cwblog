CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(10) unsigned NOT NULL DEFAULT 1,
  `user_id` char(36) NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slug` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(250) COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT 0,
  `format` tinyint(1) NOT NULL DEFAULT 0,
  `visibility` tinyint(1) NOT NULL DEFAULT 0,
  `comment_status` tinyint(1) NOT NULL DEFAULT 1,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `posts_slug_unique` (`slug`),
  KEY `format_status_date` (`format`,`status`,`published_at`,`id`),
  KEY `slug` (`slug`),
  KEY `site_id` (`site_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (site_id) REFERENCES sites(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;