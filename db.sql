CREATE TABLE IF NOT EXISTS users (
  `id` CHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `roles` ENUM('admin', 'user') DEFAULT 'user',
  `status` TINYINT DEFAULT 1 COMMENT '1: Active, 0: Inactive',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS `accounts` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `current_balance` decimal(10,2) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `user_id` char(50) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);