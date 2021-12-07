CREATE TABLE `casa_pignataro`.`payment_method` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `name` VARCHAR(50) NOT NULL,
  `url` VARCHAR(255),
  PRIMARY KEY (`id`),
  UNIQUE KEY `paymentmethod_name_unique` (`name`)
);