CREATE TABLE `casa_pignataro`.`company` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `email` VARCHAR(255),
  `linephone` VARCHAR(255),
  `cellphone` VARCHAR(255),
  `address` VARCHAR(255),
  `hours` TEXT,
  PRIMARY KEY (`id`)
);