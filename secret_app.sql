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
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(15) NULL,
  `password` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `secret_app`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secret_app`.`contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contact_first_name` VARCHAR(255) NULL,
  `contact_last_name` VARCHAR(255) NULL,
  `contact_email` VARCHAR(255) NULL,
  `contact_phone` VARCHAR(15) NULL,
  `contact_relationship` VARCHAR(225) NULL,
  `contact_status` INT NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `secret_app`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `secret_app`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secret_app`.`events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(255) NULL,
  `event_note` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_events_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_events_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `secret_app`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
