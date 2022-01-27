CREATE TABLE `casa_pignataro`.`section` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
)