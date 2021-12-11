CREATE TABLE `casa_pignataro`.`article` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkCategorie` INT UNSIGNED NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `value` DOUBLE NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `article_fkCategorie_foreign` FOREIGN KEY (`fkCategorie`) REFERENCES `categorie` (`id`)
);