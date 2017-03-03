-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema secret_app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema secret_app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `secret_app` DEFAULT CHARACTER SET utf8 ;
USE `secret_app` ;

-- -----------------------------------------------------
-- Table `secret_app`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secret_app`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NULL DEFAULT NULL,
  `last_name` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `phone` VARCHAR(15) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `secret_app`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secret_app`.`contacts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `contact_first_name` VARCHAR(255) NULL DEFAULT NULL,
  `contact_last_name` VARCHAR(255) NULL DEFAULT NULL,
  `contact_email` VARCHAR(255) NULL DEFAULT NULL,
  `contact_phone` VARCHAR(15) NULL DEFAULT NULL,
  `contact_relationship` VARCHAR(225) NULL DEFAULT NULL,
  `contact_status` INT(11) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `users_id` INT(11) NOT NULL,
  `crypto_code` VARCHAR(45) NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `secret_app`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `secret_app`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secret_app`.`events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(255) NULL DEFAULT NULL,
  `event_note` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_events_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_events_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `secret_app`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;