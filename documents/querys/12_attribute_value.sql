
CREATE TABLE `casa_pignataro`.`attribute_value` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkAttribute` INT UNSIGNED NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk__attribute_value__attribute` FOREIGN KEY (`fkAttribute`) REFERENCES `attribute` (`id`)
);