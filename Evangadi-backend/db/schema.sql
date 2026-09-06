CREATE DATABASE IF NOT EXISTS evangadi_forum
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE evangadi_forum;

CREATE TABLE users (
  userid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (userid),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE questions (
  questionid VARCHAR(32) NOT NULL,
  userid BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (questionid),
  KEY idx_questions_userid (userid),
  KEY idx_questions_created_at (created_at),
  CONSTRAINT fk_questions_user
    FOREIGN KEY (userid)
    REFERENCES users (userid)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE answer (
  answerid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  userid BIGINT UNSIGNED NOT NULL,
  questionid VARCHAR(32) NOT NULL,
  answer_text TEXT NOT NULL,
  PRIMARY KEY (answerid),
  KEY idx_answer_userid (userid),
  KEY idx_answer_questionid (questionid),
  CONSTRAINT fk_answer_user
    FOREIGN KEY (userid)
    REFERENCES users (userid),
  CONSTRAINT fk_answer_question
    FOREIGN KEY (questionid)
    REFERENCES questions (questionid)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE=utf8mb4_unicode_ci;
