ALTER TABLE `casa_pignataro`.`attribute`
  DROP FOREIGN KEY `fk_attribute_categorie`,
  DROP COLUMN `fkCategorie`,
  ADD COLUMN `fkCategory` INT UNSIGNED NOT NULL,
  ADD CONSTRAINT `fk_attribute_category` FOREIGN KEY (`fkCategory`) REFERENCES `casa_pignataro`.`category` (`id`);