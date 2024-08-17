DROP DATABASE IF EXISTS dreamspace;

CREATE DATABASE IF NOT EXISTS dreamspace;

USE dreamspace;

GRANT ALL PRIVILEGES ON dreamspace.* TO 'secure_user'@'localhost' IDENTIFIED BY 'dreamspace';
FLUSH PRIVILEGES;

CREATE TABLE profilo (
  email VARCHAR(100) UNIQUE,
  password CHAR(100) NOT NULL,
  nome VARCHAR(100),
  cognome VARCHAR(100)
);

CREATE TABLE followers (
  author VARCHAR(100),
  follower VARCHAR(100),
  PRIMARY KEY (author, follower),
  FOREIGN KEY (author) REFERENCES profilo(email),
  FOREIGN KEY (follower) REFERENCES profilo(email)
);

CREATE TABLE post (
  post_id INT PRIMARY KEY AUTO_INCREMENT,
  author VARCHAR(100),
  description VARCHAR(500),
  FOREIGN KEY (author) REFERENCES profilo(email)
);

CREATE TABLE post_photos (
  post_id INT,
  photo_url VARCHAR(500),
  FOREIGN KEY (post_id) REFERENCES Post(post_id),
  PRIMARY KEY (post_id, photo_url)
);

CREATE TABLE post_comments (
  post_id INT,
  author VARCHAR(100),
  comment VARCHAR(500),
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES post(post_id),
  FOREIGN KEY (author) REFERENCES profilo(email),
  PRIMARY KEY (post_id, author, comment, datetime)
);

CREATE TABLE notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  sender VARCHAR(100),
  receiver VARCHAR(100),
  message VARCHAR(200),
  status BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (receiver) REFERENCES profilo(email),
  FOREIGN KEY (sender) REFERENCES profilo(email)
);
