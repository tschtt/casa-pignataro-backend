CREATE TABLE `casa_pignataro`.`category` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `name` VARCHAR(50) NOT NULL,
  `fkSection` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_section` FOREIGN KEY (`fkSection`) REFERENCES `section` (`id`)
)