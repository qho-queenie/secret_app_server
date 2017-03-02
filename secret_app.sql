-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema secret_app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema secret_app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `secret_app` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`admin_logins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`admin_logins` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(255) NULL DEFAULT NULL,
  `category_description` VARCHAR(5000) NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`class_descriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`class_descriptions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `class_name` VARCHAR(255) NULL DEFAULT NULL,
  `categories_id` INT(11) NOT NULL,
  `class_description` VARCHAR(5000) NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `categories_id`),
  INDEX `fk_class_descriptions_categories1_idx` (`categories_id` ASC),
  CONSTRAINT `fk_class_descriptions_categories1`
    FOREIGN KEY (`categories_id`)
    REFERENCES `mydb`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`locations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `location_name` VARCHAR(255) NULL DEFAULT NULL,
  `location_description` VARCHAR(5000) NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`class_instances`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`class_instances` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `locations_id` INT(11) NOT NULL,
  `class_descriptions_id` INT(11) NOT NULL,
  `start_date` DATETIME NULL DEFAULT NULL,
  `end_date` DATETIME NULL DEFAULT NULL,
  `min_students` INT(11) NULL DEFAULT NULL,
  `max_students` INT(11) NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `locations_id`, `class_descriptions_id`),
  INDEX `fk_class_instances_locations1_idx` (`locations_id` ASC),
  INDEX `fk_class_instances_class_descriptions1_idx` (`class_descriptions_id` ASC),
  CONSTRAINT `fk_class_instances_class_descriptions1`
    FOREIGN KEY (`class_descriptions_id`)
    REFERENCES `mydb`.`class_descriptions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_class_instances_locations1`
    FOREIGN KEY (`locations_id`)
    REFERENCES `mydb`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`students` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NULL DEFAULT NULL,
  `last_name` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 61
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`classes_has_students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`classes_has_students` (
  `class_instance_id` INT(11) NOT NULL,
  `student_id` INT(11) NOT NULL,
  `register_date` DATETIME NULL DEFAULT NULL,
  `waitlisted` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`class_instance_id`, `student_id`),
  INDEX `fk_classes_has_students_students1_idx` (`student_id` ASC),
  INDEX `fk_classes_has_students_classes_idx` (`class_instance_id` ASC),
  CONSTRAINT `fk_classes_has_students_classes`
    FOREIGN KEY (`class_instance_id`)
    REFERENCES `mydb`.`class_instances` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_classes_has_students_students1`
    FOREIGN KEY (`student_id`)
    REFERENCES `mydb`.`students` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NULL DEFAULT NULL,
  `last_name` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`contacts` (
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
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`events` (
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
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`waitlist`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`waitlist` (
  `classes_id` INT(11) NOT NULL,
  `students_id` INT(11) NOT NULL,
  PRIMARY KEY (`classes_id`, `students_id`),
  INDEX `fk_classes_has_students1_students1_idx` (`students_id` ASC),
  INDEX `fk_classes_has_students1_classes1_idx` (`classes_id` ASC),
  CONSTRAINT `fk_classes_has_students1_classes1`
    FOREIGN KEY (`classes_id`)
    REFERENCES `mydb`.`class_instances` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_classes_has_students1_students1`
    FOREIGN KEY (`students_id`)
    REFERENCES `mydb`.`students` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

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
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `secret_app`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 7
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
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
