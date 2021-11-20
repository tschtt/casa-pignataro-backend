DROP TABLE `casa_pignataro`.`admin_session`;
CREATE TABLE `casa_pignataro`.`admin_session` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkAdmin` INT UNSIGNED NOT NULL,
  `token` VARCHAR(255),
  PRIMARY KEY (`id`),
  KEY `adminsession_fkAdmin_foreign` (`fkAdmin`),
  CONSTRAINT `adminsession_fkAdmin_foreign` FOREIGN KEY (`fkAdmin`) REFERENCES `admin` (`id`) ON DELETE CASCADE
);