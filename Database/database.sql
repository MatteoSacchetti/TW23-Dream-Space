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

INSERT INTO profilo (email, password, nome, cognome) VALUES ('a@a.com', 'a', 'Alessandro', 'Alessandrini');
INSERT INTO profilo (email, password, nome, cognome) VALUES ('mario.rossi@m.com', 'a', 'Mario', 'Rossi');
INSERT INTO profilo (email, password, nome, cognome) VALUES ('luisa.bianchi@b.com', 'a', 'Luisa', 'Bianchi');
INSERT INTO profilo (email, password, nome, cognome) VALUES ('alessandro.verdi@v.com', 'a', 'Alessandro', 'Verdi');
INSERT INTO profilo (email, password, nome, cognome) VALUES ('francesca.ferrari@f.com', 'a', 'Francesca', 'Ferrari');

INSERT INTO followers (author, follower) VALUES ('a@a.com', 'mario.rossi@m.com');
INSERT INTO followers (author, follower) VALUES ('a@a.com', 'luisa.bianchi@b.com');
INSERT INTO followers (author, follower) VALUES ('mario.rossi@m.com', 'a@a.com');
INSERT INTO followers (author, follower) VALUES ('mario.rossi@m.com', 'alessandro.verdi@v.com');
INSERT INTO followers (author, follower) VALUES ('luisa.bianchi@b.com', 'a@a.com');
INSERT INTO followers (author, follower) VALUES ('luisa.bianchi@b.com', 'francesca.ferrari@f.com');
INSERT INTO followers (author, follower) VALUES ('alessandro.verdi@v.com', 'a@a.com');
INSERT INTO followers (author, follower) VALUES ('alessandro.verdi@v.com', 'francesca.ferrari@f.com');
INSERT INTO followers (author, follower) VALUES ('francesca.ferrari@f.com', 'luisa.bianchi@b.com');
INSERT INTO followers (author, follower) VALUES ('francesca.ferrari@f.com', 'alessandro.verdi@v.com');

INSERT INTO post (author, description) VALUES ('a@a.com', "Sesta scheda di body building per giovane uomo che si appresta alla prova costume. La scheda consiste in un primo esercizio di forza possibilmente a corpo libero e i successivi 3 sempre dello stesso distretto muscolare incentrati sull'ipertrofia pura, classica suddivisione in 3 giorni per poter attivare nell'arco del microciclo tutti i gruppi muscolari");
INSERT INTO post (author, description) VALUES ('mario.rossi@m.com', "Prima scheda di body building per giovane donna che si appresta a un potenziamento muscolare. La scheda consiste in un primo esercizio di forza possibilmente al macchinario e i successivi 3 sempre dello stesso distretto muscolare incentrati sull' ipertrofia pura, con forte impatto addominale, classica suddivisione in 3 giorni per poter attivare nell' arco del microciclo tutti i gruppi muscolari");
INSERT INTO post (author, description) VALUES ('mario.rossi@m.com', "Scheda per uomo, pensata per fare un lavoro esclusivo sulla forza, suddivisone in 5 giorni per poter centralizzare l'allenamento su un gruppo muscolare in particolare permettendogli un recupero totale per poter massimizzare i risultati. Ogni gruppo muscolare viene soggetto a 4 esercizi di forza e uno di ipertrofia con impatto zero sull'addome per mantenere sempre attivo il distretto muscolare interessato");
INSERT INTO post (author, description) VALUES ('a@a.com', "Prima scheda per giovane uomo, pensata per allenamento a casa quindi con dotazioni limitate ad esempio elastici o manubri. Suddivisione del microciclo in 2 giornate settimanali che però comprende ogni gruppo muscolare. Realizzata per un allenamento breve ma intenso focalizzato sulla resistenza");
INSERT INTO post (author, description) VALUES ('luisa.bianchi@b.com', "Prima scheda per donna di tipo ginoide, quindi con fisico a pera che accumula grasso nella parte inferiore del corpo. I primi esercizi sono sempre realizzati per la parte inferiore del corpo poi per quella intermedia e infine per la parte alta in modo da permettere al flusso di sangue di scorrere in tutto il corpo e terminare nella parte superiore permettendo alla parte bassa del corpo di assumere una forma più affusolata. Classica suddivisione del microciclo in 3 giorni con esercizi centrati soprattutto sull' ipertrofia");
INSERT INTO post (author, description) VALUES ('alessandro.verdi@v.com', "Scheda per giovane uomo, realizzata per aumentare la forza con primo esercizio base in cui si attivano più gruppi muscolari e successivi 3 per l'ipertrofia generale del muscolo allenato, lo stesso principio viene applicato al gruppo muscolare successivo. Allenamento per tutto il corpo in 3 giorni con poco influenzamento dell' addome.");
INSERT INTO post (author, description) VALUES ('francesca.ferrari@f.com', "Scheda per giovane donna, realizzata per aumentare la tonicità con primo esercizio base cioè di forza in cui si attivano più gruppi muscolari e i successivi 3 per l'ipertrofia generale del muscolo allenato, lo stesso principio viene applicato al gruppo muscolare successivo. Allenamento per tutto il corpo in 3 giorni con sufficente influenzamento dell'addome.");

INSERT INTO post_photos (post_id, photo_url) VALUES (1, '../Image/1-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (1, '../Image/1-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (1, '../Image/1-3.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (2, '../Image/2-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (2, '../Image/2-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (2, '../Image/2-3.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (3, '../Image/3-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (3, '../Image/3-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (3, '../Image/3-3.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (3, '../Image/3-4.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (3, '../Image/3-5.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (4, '../Image/4-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (4, '../Image/4-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (5, '../Image/5-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (5, '../Image/5-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (5, '../Image/5-3.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (6, '../Image/6-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (6, '../Image/6-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (6, '../Image/6-3.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (7, '../Image/7-1.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (7, '../Image/7-2.jpg');
INSERT INTO post_photos (post_id, photo_url) VALUES (7, '../Image/7-3.jpg');

INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (1, 'mario.rossi@m.com', 'Ottimo programma! Sto cercando di migliorare la mia forma fisica e credo che questa scheda possa fare al caso mio.', '2024-08-15 20:00:00');
INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (1, 'luisa.bianchi@b.com', 'Interessante! Mi chiedevo se fosse possibile adattare la scheda anche per un allenamento in casa senza attrezzature.', '2024-08-15 23:00:00');
INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (2, 'francesca.ferrari@f.com', 'Grazie per la scheda! Ho appena iniziato a fare body building e trovo utile avere un programma strutturato.', '2024-08-16 12:00:00');
INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (2, 'a@a.com', 'Prego Francesca! Fammi sapere come va con la scheda e se hai bisogno di ulteriori suggerimenti.', '2024-08-16 15:00:00');
INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (2, 'alessandro.verdi@v.com', 'Scheda ben strutturata, ma sarebbe utile un piccolo adattamento per chi ha già un buon livello di fitness.', '2024-08-16 18:00:00');
INSERT INTO post_comments (post_id, author, comment, datetime) VALUES (2, 'a@a.com', 'La scheda sembra molto completa. Considero di aggiungere qualche esercizio per le spalle e le gambe, cosa ne pensate?', '2024-08-17 21:00:00');

INSERT INTO notifications (sender, receiver, message) VALUES ('a@a.com', 'mario.rossi@m.com', 'Alessandro Alessandrini ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('a@a.com', 'luisa.bianchi@b.com', 'Alessandro Alessandrini ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('mario.rossi@m.com', 'a@a.com', 'Mario Rossi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('mario.rossi@m.com', 'alessandro.verdi@v.com', 'Mario Rossi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('luisa.bianchi@b.com', 'a@a.com', 'Luisa Bianchi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('luisa.bianchi@b.com', 'francesca.ferrari@f.com', 'Luisa Bianchi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('alessandro.verdi@v.com', 'a@a.com', 'Alessandro Verdi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('alessandro.verdi@v.com', 'francesca.ferrari@f.com', 'Alessandro Verdi ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('francesca.ferrari@f.com', 'luisa.bianchi@b.com', 'Francesca Ferrari ha iniziato a seguirti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('francesca.ferrari@f.com', 'alessandro.verdi@v.com', 'Francesca Ferrari ha iniziato a seguirti.');

INSERT INTO notifications (sender, receiver, message) VALUES ('mario.rossi@m.com', 'a@a.com', 'Mario Rossi ha commentato il tuo post: Ottimo programma! Sto cercando di migliorare la mia forma fisica e credo che questa scheda possa fare al caso mio.');
INSERT INTO notifications (sender, receiver, message) VALUES ('luisa.bianchi@b.com', 'a@a.com', 'Luisa Bianchi ha commentato il tuo post: Interessante! Mi chiedevo se fosse possibile adattare la scheda anche per un allenamento in casa senza attrezzature.');
INSERT INTO notifications (sender, receiver, message) VALUES ('francesca.ferrari@f.com', 'mario.rossi@m.com', 'Francesca Ferrari ha commentato il tuo post: Grazie per la scheda! Ho appena iniziato a fare body building e trovo utile avere un programma strutturato.');
INSERT INTO notifications (sender, receiver, message) VALUES ('a@a.com', 'mario.rossi@m.com', 'Alessandro Alessandrini ha commentato il tuo post: Prego Francesca! Fammi sapere come va con la scheda e se hai bisogno di ulteriori suggerimenti.');
INSERT INTO notifications (sender, receiver, message) VALUES ('alessandro.verdi@v.com', 'mario.rossi@m.com', 'Alessandro Verdi ha commentato il tuo post: Scheda ben strutturata, ma sarebbe utile un piccolo adattamento per chi ha già un buon livello di fitness.');
INSERT INTO notifications (sender, receiver, message) VALUES ('a@a.com', 'mario.rossi@m.com', 'Alessandro Alessandrini ha commentato il tuo post: La scheda sembra molto completa. Considero di aggiungere qualche esercizio per le spalle e le gambe, cosa ne pensate?');
