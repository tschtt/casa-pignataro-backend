DELETE FROM `casa_pignataro`.`article`;
ALTER TABLE `casa_pignataro`.`article`
  DROP FOREIGN KEY `article_fkCategorie_foreign`,
  DROP COLUMN `fkCategorie`,
  ADD COLUMN `fkCategory` INT UNSIGNED NOT NULL,
  ADD CONSTRAINT `fk_article_category` FOREIGN KEY (`fkCategory`) REFERENCES `casa_pignataro`.`category` (`id`);