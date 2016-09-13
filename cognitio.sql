CREATE TABLE Perfil (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre CHAR(15),
cantidad INT(10)
);
CREATE TABLE Estudiante (
rol INT(10) UNSIGNED PRIMARY KEY,
dv CHAR(1) NOT NULL,
perfil_id INT(10) UNSIGNED NULL,
nombre CHAR(20) NULL,
apellido1 CHAR(20) NULL,
apellido2 CHAR(20) NULL,
correo CHAR(30) UNIQUE,
foto CHAR(255) NULL,
password CHAR(50) NOT NULL,
paralelo TINYINT NULL,
test BIT NULL,
FOREIGN KEY (perfil_id) REFERENCES Perfil(id) ON UPDATE CASCADE
);
CREATE TABLE Profesor (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre CHAR(20) NOT NULL,
apellido1 CHAR(20) NOT NULL,
apellido2 CHAR(20) NOT NULL,
correo CHAR(30) NOT NULL,
foto CHAR(255) NOT NULL,
password CHAR(50) NULL,
coordinador BIT NOT NULL,
suspendido BIT NOT NULL
);
CREATE TABLE Etiqueta (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre_etiqueta CHAR(50) NOT NULL
);
CREATE TABLE Unidad (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
profesor_id INT(10) UNSIGNED,
titulo CHAR(50) NOT NULL,
descripcion CHAR(140) NOT NULL,
FOREIGN KEY (profesor_id) REFERENCES Profesor(id) ON UPDATE CASCADE
);
CREATE TABLE Topico (
id_uni INT(10) UNSIGNED,
id INT(10) UNSIGNED,
titulo CHAR(50) NOT NULL,
descripcion CHAR(140) NOT NULL,
profesor_id INT(10) UNSIGNED,
PRIMARY KEY (id_uni,id),
FOREIGN KEY (profesor_id) REFERENCES Profesor(id) ON UPDATE CASCADE,
FOREIGN KEY (id_uni) REFERENCES Unidad(id) ON UPDATE CASCADE
);
CREATE TABLE Contenido (
id_uni INT(10) UNSIGNED,
id_top INT(10) UNSIGNED,
id INT(10) UNSIGNED,
titulo CHAR(50) NOT NULL,
info TEXT,
archivo CHAR(255),
borrador BIT,
etiqueta_id INT(10) UNSIGNED,
profesor_id INT(10) UNSIGNED,
PRIMARY KEY (id_uni,id_top,id),
FOREIGN KEY (etiqueta_id) REFERENCES Etiqueta(id) ON UPDATE CASCADE,
FOREIGN KEY (profesor_id) REFERENCES Profesor(id) ON UPDATE CASCADE,
FOREIGN KEY (id_uni,id_top) REFERENCES Topico(id_uni,id) ON UPDATE CASCADE
);
CREATE TABLE Perfil_Etiqueta (
perfil_id INT(10) UNSIGNED,
etiqueta_id INT(10) UNSIGNED,
PRIMARY KEY (perfil_id, etiqueta_id),
FOREIGN KEY (perfil_id) REFERENCES Perfil(id) ON UPDATE CASCADE,
FOREIGN KEY (etiqueta_id) REFERENCES Etiqueta(id) ON UPDATE CASCADE
);
CREATE TABLE Feedback (
id INT(10) UNSIGNED,
rol INT(10) UNSIGNED,
calificacion TINYINT,
soporte BIT,
comentario CHAR(140),
uni_id INT(10) UNSIGNED,
top_id INT(10) UNSIGNED,
com_id INT(10) UNSIGNED,
PRIMARY KEY(id,rol,uni_id,top_id,com_id),
FOREIGN KEY (uni_id,top_id,com_id) REFERENCES Contenido(id_uni,id_top,id) ON UPDATE CASCADE,
FOREIGN KEY (rol) REFERENCES Estudiante(rol) ON UPDATE CASCADE
);

DROP PROCEDURE IF EXISTS Secuencia;
DELIMITER //
CREATE PROCEDURE Secuencia (n VARCHAR(20), st INT)
BEGIN
CREATE TABLE IF NOT EXISTS ____secuencias (
nombre VARCHAR(20) NOT NULL UNIQUE,
siguiente INT NOT NULL
);
INSERT INTO ____secuencias VALUES (n, st);
END // 
DELIMITER ;

DROP PROCEDURE IF EXISTS BorrarSecuencia;
DELIMITER //
CREATE PROCEDURE BorrarSecuencia (n VARCHAR(20))
BEGIN
DELETE FROM ____secuencias WHERE nombre = n;
END 
// 
DELIMITER ;

DROP FUNCTION IF EXISTS NextVal;
DELIMITER //
CREATE FUNCTION NextVal (n VARCHAR(20))
RETURNS INT
BEGIN
UPDATE ____secuencias SET siguiente = (@siguiente := siguiente) + 1 WHERE nombre = n;
RETURN @siguiente;
END 
// 
DELIMITER ;

CALL Secuencia('seq_topico', 1);
CALL Secuencia('seq_contenido', 1);
CALL Secuencia('seq_feedback', 1);

DROP TRIGGER IF EXISTS NuevoTopico;
DELIMITER //
CREATE TRIGGER NuevoTopico BEFORE INSERT ON Topico
FOR EACH ROW BEGIN
SET NEW.id = (SELECT NextVal('seq_topico'));
END //
DELIMITER ;

DROP TRIGGER IF EXISTS NuevoContenido;
DELIMITER //
CREATE TRIGGER NuevoContenido BEFORE INSERT ON Contenido
FOR EACH ROW BEGIN
SET NEW.id = (SELECT NextVal('seq_contenido'));
END //
DELIMITER ;

DROP TRIGGER IF EXISTS NuevoFeedback;
DELIMITER //
CREATE TRIGGER NuevoFeedback BEFORE INSERT ON Feedback
FOR EACH ROW BEGIN
SET NEW.id = (SELECT NextVal('seq_feedback'));
END //
DELIMITER ;
