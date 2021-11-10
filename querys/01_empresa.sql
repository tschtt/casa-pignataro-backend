CREATE TABLE `casa_pignataro`.`empresa` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `email` VARCHAR(255),
  `telefono` VARCHAR(255),
  `whatsapp` VARCHAR(255),
  `direccion` VARCHAR(255),
  `horarios` TEXT,
  PRIMARY KEY (`id`)
);