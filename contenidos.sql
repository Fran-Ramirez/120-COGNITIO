INSERT INTO Perfil (nombre,cantidad) VALUES ('Adaptador', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Asimilador', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Convergente', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Divergente', 0);

INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 1: Carga Electrica', 'Electricidad');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 2: Ley Coulomb', 'Todo sobre ley de coulomb');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 3: Campo Electrico', 'Campos electricos y mucho mas');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 4: Imanes', 'Aplicaciones sobre imanes yteoria');

INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (1,'Topico 1:Carga Electrica','Primer topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (1,'Topico 2:Carga Electrica','Segundo topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (1,'Topico 3:Carga Electrica','Tercer topico');

INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (2,'Topico 1:Ley Coulomb','Primer topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (2,'Topico 2:Ley Coulomb','Segundo topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (2,'Topico 3:Ley Coulomb','Tercer topico');

INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (3,'Topico 1:Campo Electrico','Primer topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (3,'Topico 2:Campo Electrico','Segundo topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (3,'Topico 3:Campo Electrico','Tercer topico');

INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (4,'Topico 1:Imanes','Primer topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (4,'Topico 2:Imanes','Segundo topico');
INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (4,'Topico 3:Imanes','Tercero topico');

INSERT INTO Etiqueta (nombre_etiqueta) VALUES ('definicion matematica');
INSERT INTO Etiqueta (nombre_etiqueta) VALUES ('ejemplo grafico');
INSERT INTO Etiqueta (nombre_etiqueta) VALUES ('experimento');
INSERT INTO Etiqueta (nombre_etiqueta) VALUES ('definicion conceptual');

INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (1,1);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (2,2);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (3,3);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (4,4);

INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id) VALUES (1,1,'Contenido topico 1', 'para adaptador',1);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id) VALUES (1,1,'Contenido topico 1', 'para asimilador',2);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id) VALUES (1,1,'Contenido topico 1', 'para convergente',3);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id) VALUES (1,1,'Contenido topico 1', 'para divergente',4);

INSERT INTO Profesor (nombre,apellido1,apellido2,correo,password,coordinador,suspendido) VALUES ('luis','Suarez','diaz','mordelon@profesor.usm.cl','e2236ddc5a2c764f4a3ab5c877bd5a58',1,0);

