
CREATE TABLE `casa_pignataro`.`nn_article_attribute_value` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkAttributeValue` INT UNSIGNED NOT NULL,
  `fkArticle` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk__nn_article_attribute_value__article` FOREIGN KEY (`fkArticle`) REFERENCES `attribute` (`id`),
  CONSTRAINT `fk__nn_article_attribute_value__attribute_value` FOREIGN KEY (`fkAttributeValue`) REFERENCES `attribute_value` (`id`)
);