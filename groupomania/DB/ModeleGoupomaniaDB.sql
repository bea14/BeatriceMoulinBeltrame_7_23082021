-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema groupomania
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema groupomania
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `groupomania` DEFAULT CHARACTER SET utf8 ;
USE `groupomania` ;

-- -----------------------------------------------------
-- Table `groupomania`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`user` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `lastname` VARCHAR(80) NULL DEFAULT NULL COMMENT 'Nom de famille de l\'utilisateur',
  `firstname` VARCHAR(80) NULL DEFAULT NULL COMMENT 'Prenom de l\'utilisateur',
  `pseudo` VARCHAR(255) NOT NULL COMMENT 'Pseudo de l\'utilisateur',
  `email` VARCHAR(255) NOT NULL COMMENT 'Email de l\'utilisateur',
  `password` LONGTEXT NULL DEFAULT NULL COMMENT 'Mot de passe de l\'utilisateur',
  `sexe` CHAR(5) NULL DEFAULT NULL COMMENT 'Sexe de l\'utilisateur : Masculin (M)/Feminin (F) ou Autre (A)',
  `avatar` VARCHAR(255) NOT NULL DEFAULT 'default-avatar.png' COMMENT 'Avatar de l\'utilisateur, par defaut default-avatar.png',
  `birthdate` DATE NULL DEFAULT NULL COMMENT 'Date de naissance de l\'utilisateur',
  `bio` LONGTEXT NULL DEFAULT NULL COMMENT 'Bio de l\'utilisateur',
  `creationdate` TIMESTAMP NULL DEFAULT NULL COMMENT 'Date de creation du compte de l\'utilisateur, par defaut date du jour',
  `updatedate` TIMESTAMP NULL DEFAULT NULL COMMENT 'Date de modification du compte de l\'utilisateur, par defaut date du jour de la mise a jour',
  `role` DECIMAL(1,0) NOT NULL DEFAULT '0' COMMENT 'Groupe de l\'utilisateur : membre = 0, moderateur = 1, administrateur = 2',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_email` (`email`),
  UNIQUE INDEX `user_pseudo` (`pseudo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `groupomania`.`topics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`topics` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Titre du post',
  `content` LONGTEXT NULL DEFAULT NULL COMMENT 'Contenu du poste, du texte ou un lien',
  `media_url` LONGTEXT NULL DEFAULT NULL COMMENT 'Image ou video joint au post',
  `author` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'Auteur du post, lien avec table user',
  `creationdate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de creation du post, par defaut la date du jour',
  `updatedate` TIMESTAMP NULL DEFAULT NULL COMMENT 'Date de mise à jour du post',
  `tag` VARCHAR(45) NULL DEFAULT NULL COMMENT 'categorie du post, une seule valeur acceptee pour l\'instant',
  `isreported` VARCHAR(2) NULL DEFAULT 'N' COMMENT 'Indique si l\'article est signalé ou non. Par défaut N sinon O',
  `isreporteddate` TIMESTAMP NULL COMMENT 'Date du signalement de l\'article',
  PRIMARY KEY (`id`),
  INDEX `id` (`author`),
  CONSTRAINT `author`
    FOREIGN KEY (`author`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `groupomania`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`comments` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `author` INT(11) UNSIGNED NOT NULL COMMENT 'Auteur du commentaire, lien avec table user',
  `topic` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'Article concerne par le commentaire, lien avec table topics',
  `content` LONGTEXT NULL DEFAULT NULL COMMENT 'Contenu du commentaire',
  `creationdate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de creation du commentaire, par defaut date du jour',
  `updatedate` DATETIME NULL DEFAULT NULL COMMENT 'Date de mise a jour du commentaire',
  `isreported` VARCHAR(2) NULL DEFAULT 'N' COMMENT 'Indique si le commentaire est signalé ou non. Par défaut N sinon O',
  `isreporteddate` TIMESTAMP NULL COMMENT 'Indique la date à laquelle le post a ete signale',
  PRIMARY KEY (`id`),
  INDEX `author` (`author`),
  INDEX `topic` (`topic`),
  CONSTRAINT `auth`
    FOREIGN KEY (`author`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `topic`
    FOREIGN KEY (`topic`)
    REFERENCES `groupomania`.`topics` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `groupomania`.`commentsvotes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`commentsvotes` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `likedislike` INT(11) UNSIGNED NULL DEFAULT '0' COMMENT 'Nombre de j\'aime/j\'aime pas pour un commentaire, vaut 0 par défaut, -1 pour aime pas et +1 pour aime',
  `user` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'id de l\'utilisateur qui a aime ou pas',
  `comment` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'id du commentaire concerne par le j\'aime /j\'aime pas',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PRIMARY2` (`user`, `comment`),
  INDEX `user` (`user`),
  INDEX `comment` (`comment`),
  CONSTRAINT `comment`
    FOREIGN KEY (`comment`)
    REFERENCES `groupomania`.`comments` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `user`
    FOREIGN KEY (`user`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `groupomania`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`roles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT 'member' COMMENT 'Nom des groupes utilisateurs : member, moderator, administrator',
  `value` TINYINT(4) NULL DEFAULT '0' COMMENT 'Valeur du groupe : 0 pour membre/1 pour moderateur/2 pour admin',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `groupomania`.`tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`tags` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tag_name` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Nom des differentes categories',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `groupomania`.`topicsvotes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`topicsvotes` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `likedislike` INT(11) NULL DEFAULT NULL COMMENT 'nombre de likes/dislike de l\'article, vaut 0 si rien, -1 si dislikes et +1 si likes',
  `user` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'utilisateur qui a fait les like ou dislike',
  `topic` INT(11) UNSIGNED NULL DEFAULT NULL COMMENT 'article concerné par les likes ou dislikes, on récupère l\'id du tableau topics',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PRIMARY2` (`user`, `topic`),
  INDEX `user` (`user`),
  INDEX `topic` (`topic`),
  CONSTRAINT `users`
    FOREIGN KEY (`user`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `topics`
    FOREIGN KEY (`topic`)
    REFERENCES `groupomania`.`topics` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
