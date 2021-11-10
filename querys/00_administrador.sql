DROP TABLE `casa_pignataro`.`adminisitradores`;
CREATE TABLE `casa_pignataro`.`adminisitrador` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_usuario_unique` (`usuario`),
  UNIQUE KEY `admin_email_unique` (`email`)
);