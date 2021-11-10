CREATE TABLE `casa_pignataro`.`metodo_pago` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `nombre` VARCHAR(50) NOT NULL,
  `url` VARCHAR(255),
  PRIMARY KEY (`id`),
  UNIQUE KEY `metodopago_nombre_unique` (`nombre`)
);