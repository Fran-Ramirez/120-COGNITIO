CREATE TABLE Perfil (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre CHAR(15),
cantidad INT(10)
);
CREATE TABLE Estudiante (
rol INT(10) UNSIGNED PRIMARY KEY,
dv CHAR(1) NOT NULL,
perfil_id INT(10) UNSIGNED DEFAULT 2,
nombre CHAR(20) NULL,
apellido1 CHAR(20) NULL,
apellido2 CHAR(20) NULL,
correo CHAR(50) UNIQUE,
foto CHAR(255) NULL,
password CHAR(50) NOT NULL,
paralelo TINYINT NULL,
test TINYINT(1) NULL,
suspendido TINYINT(1) NOT NULL DEFAULT 0,
FOREIGN KEY (perfil_id) REFERENCES Perfil(id) ON UPDATE CASCADE
);
CREATE TABLE Profesor (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre CHAR(20) NULL,
apellido1 CHAR(20) NULL,
apellido2 CHAR(20) NULL,
correo CHAR(50) UNIQUE,
foto CHAR(255) NULL,
password CHAR(50) NOT NULL,
coordinador TINYINT(1) NOT NULL,
suspendido TINYINT(1) NOT NULL DEFAULT 0
);
CREATE TABLE Etiqueta (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre_etiqueta CHAR(50) NOT NULL,
descripcion char(255) NOT NULL
);
CREATE TABLE Unidad (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
profesor_id INT(10) UNSIGNED,
titulo CHAR(50) NOT NULL,
descripcion CHAR(140) NOT NULL,
visible TINYINT(1) DEFAULT 1,
pos INT(10) UNSIGNED,
FOREIGN KEY (profesor_id) REFERENCES Profesor(id) ON UPDATE CASCADE
);
CREATE TABLE Topico (
id_uni INT(10) UNSIGNED,
id INT(10) UNSIGNED,
titulo CHAR(50) NOT NULL,
descripcion CHAR(140) NOT NULL,
profesor_id INT(10) UNSIGNED,
visible TINYINT(1) DEFAULT 1,
pos INT(10) UNSIGNED,
PRIMARY KEY (id_uni,id),
FOREIGN KEY (profesor_id) REFERENCES Profesor(id) ON UPDATE CASCADE,
FOREIGN KEY (id_uni) REFERENCES Unidad(id) ON UPDATE CASCADE
);
CREATE TABLE Contenido (
id_uni INT(10) UNSIGNED,
id_top INT(10) UNSIGNED,
id INT(10) UNSIGNED,
titulo CHAR(50),
info TEXT,
archivo CHAR(255),
borrador TINYINT(1),
visible TINYINT(1) DEFAULT 1,
pos INT(10) UNSIGNED,
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
soporte TINYINT(1),
comentario CHAR(140),
uni_id INT(10) UNSIGNED,
top_id INT(10) UNSIGNED,
com_id INT(10) UNSIGNED,
PRIMARY KEY(id,rol,uni_id,top_id,com_id),
FOREIGN KEY (uni_id,top_id,com_id) REFERENCES Contenido(id_uni,id_top,id) ON UPDATE CASCADE,
FOREIGN KEY (rol) REFERENCES Estudiante(rol) ON UPDATE CASCADE
);
CREATE TABLE Sesion (
id VARCHAR(255) COLLATE utf8_bin NOT NULL,
fecha INT(11) UNSIGNED NOT NULL,
datos TEXT,
PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS PosUnidad;
DELIMITER //
CREATE TRIGGER PosUnidad BEFORE INSERT ON Unidad
FOR EACH ROW BEGIN
DECLARE aux_pos1 INT(10) UNSIGNED;
DECLARE aux_pos2 INT(10) UNSIGNED;
SELECT MAX(pos) INTO aux_pos1 FROM Unidad;
SELECT IFNULL(aux_pos1,0) INTO aux_pos2;
SET NEW.pos = (aux_pos2+1);
END //
DELIMITER ;

DROP TRIGGER IF EXISTS NuevoTopico;
DELIMITER //
CREATE TRIGGER NuevoTopico BEFORE INSERT ON Topico
FOR EACH ROW BEGIN
DECLARE aux_id1 INT(10) UNSIGNED;
DECLARE aux_id2 INT(10) UNSIGNED;
DECLARE aux_pos1 INT(10) UNSIGNED;
DECLARE aux_pos2 INT(10) UNSIGNED;
SELECT MAX(id) INTO aux_id1 FROM Topico WHERE (id_uni = NEW.id_uni);
SELECT MAX(pos) INTO aux_pos1 FROM Topico WHERE (id_uni = NEW.id_uni);
SELECT IFNULL(aux_pos1,0) INTO aux_pos2;
SELECT IFNULL(aux_id1,0) INTO aux_id2;
SET NEW.id = (aux_id2+1);
SET NEW.pos = (aux_pos2+1);
END //
DELIMITER ;

DROP TRIGGER IF EXISTS NuevoContenido;
DELIMITER //
CREATE TRIGGER NuevoContenido BEFORE INSERT ON Contenido
FOR EACH ROW BEGIN
DECLARE aux_id1 INT(10) UNSIGNED;
DECLARE aux_id2 INT(10) UNSIGNED;
DECLARE aux_pos1 INT(10) UNSIGNED;
DECLARE aux_pos2 INT(10) UNSIGNED;
SELECT MAX(id) INTO aux_id1 FROM Contenido WHERE (id_uni = NEW.id_uni AND id_top = NEW.id_top);
SELECT MAX(pos) INTO aux_pos1 FROM Contenido WHERE (id_uni = NEW.id_uni AND id_top = NEW.id_top);
SELECT IFNULL(aux_pos1,0) INTO aux_pos2;
SELECT IFNULL(aux_id1,0) INTO aux_id2;
SET NEW.id = (aux_id2+1);
IF (NEW.pos IS NULL) THEN
SET NEW.pos = (aux_pos2+1);
END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS NuevoFeedback;
DELIMITER //
CREATE TRIGGER NuevoFeedback BEFORE INSERT ON Feedback
FOR EACH ROW BEGIN
DECLARE aux_id1 INT(10) UNSIGNED;
DECLARE aux_id2 INT(10) UNSIGNED;
SELECT MAX(id) INTO aux_id1 FROM Feedback WHERE (uni_id = NEW.uni_id AND top_id = NEW.top_id AND com_id = NEW.com_id AND rol = NEW.rol);
SELECT IFNULL(aux_id1,0) INTO aux_id2;
SET NEW.id = (aux_id2+1);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS moverFeedback;
DELIMITER //
CREATE PROCEDURE moverFeedback(
IN _v_unidad INT(10) UNSIGNED,
IN _v_topico INT(10) UNSIGNED, 
IN _v_contenido INT(10) UNSIGNED,
IN _n_unidad INT(10) UNSIGNED,
IN _n_topico INT(10) UNSIGNED, 
IN _n_contenido INT(10) UNSIGNED)
BEGIN
INSERT INTO Feedback (rol,calificacion,soporte,comentario,uni_id,top_id,com_id) 
SELECT rol,calificacion,soporte,comentario,_n_unidad,_n_topico,_n_contenido FROM Feedback
WHERE (uni_id=_v_unidad AND top_id=_v_topico AND com_id=_v_contenido);
DELETE FROM Feedback WHERE (uni_id=_v_unidad AND top_id=_v_topico AND com_id=_v_contenido);
END //
DELIMITER ;

CREATE VIEW view_unidades_borradas AS
SELECT * FROM Unidad WHERE visible = 0;

CREATE VIEW view_topicos_borrados AS
SELECT * FROM Topico WHERE visible = 0 OR id_uni IN (SELECT id FROM view_unidades_borradas);

CREATE VIEW view_contenidos_borrados AS
SELECT * FROM Contenido WHERE visible = 0 OR id_top IN (SELECT id FROM view_topicos_borrados);

