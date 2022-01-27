
CREATE TABLE `casa_pignataro`.`attribute` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkCategorie` INT UNSIGNED NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_attribute_categorie` FOREIGN KEY (`fkCategorie`) REFERENCES `categorie` (`id`)
);