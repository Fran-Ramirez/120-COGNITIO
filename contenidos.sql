INSERT INTO Perfil (nombre,cantidad) VALUES ('Adaptador', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Asimilador', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Convergente', 0);
INSERT INTO Perfil (nombre,cantidad) VALUES ('Divergente', 0);

INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 1: Carga Electrica', 'Electricidad');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 2: Ley Coulomb', 'Todo sobre ley de coulomb');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 3: Campo Electrico', 'Campos electricos y mucho mas');
INSERT INTO Unidad (titulo,descripcion) VALUES ('Unidad 4: Imanes', 'Aplicaciones sobre imanes y teoria');

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

INSERT INTO Etiqueta (nombre_etiqueta,descripcion) VALUES ('definicion matematica', 'contenido matematico bla bla');
INSERT INTO Etiqueta (nombre_etiqueta,descripcion) VALUES ('ejemplo grafico', 'contenido con muchas imagenes bla bla');
INSERT INTO Etiqueta (nombre_etiqueta,descripcion) VALUES ('experimento', 'descripcion de un experimento bla bla');
INSERT INTO Etiqueta (nombre_etiqueta,descripcion) VALUES ('definicion conceptual', 'contenido con mucho texto bla bla');

INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (1,1);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (2,2);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (3,3);
INSERT INTO Perfil_Etiqueta (perfil_id,etiqueta_id) VALUES (4,4);

INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id,borrador) VALUES (1,1,'Contenido topico 1', 'para adaptador',1,0);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id,borrador) VALUES (1,1,'Contenido topico 1', 'para asimilador',2,0);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id,borrador) VALUES (1,1,'Contenido topico 1', 'para convergente',3,0);
INSERT INTO Contenido (id_uni,id_top,titulo,info,etiqueta_id,borrador) VALUES (1,1,'Contenido topico 1', 'para divergente',4,0);

INSERT INTO Estudiante (rol,dv,perfil_id,nombre,apellido1,apellido2,correo,foto,password,paralelo) VALUES (201373508,8,1,'Dominguez','Paredes','Camilo','camilo.d.13@sansano.usm.cl', NULL,'e2236ddc5a2c764f4a3ab5c877bd5a58',1);
INSERT INTO Estudiante (rol,dv,perfil_id,nombre,apellido1,apellido2,correo,foto,password,paralelo) VALUES (201104560,2,2,'Brito','Ruiz','Alan','alan.r.11@sansano.usm.cl', NULL,'e2236ddc5a2c764f4a3ab5c877bd5a58',2);
INSERT INTO Estudiante (rol,dv,perfil_id,nombre,apellido1,apellido2,correo,foto,password,paralelo) VALUES (201092008,9,3,'Salas','Benavides','Luisa','luisa.b.14@sansano.usm.cl', NULL,'e2236ddc5a2c764f4a3ab5c877bd5a58',3);

INSERT INTO Profesor (nombre,apellido1,apellido2,correo,password,coordinador,suspendido) VALUES ('Luis','Suarez','Diaz','coordinador1@profesor.usm.cl','e2236ddc5a2c764f4a3ab5c877bd5a58',1,0);
INSERT INTO Profesor (nombre,apellido1,apellido2,correo,password,coordinador,suspendido) VALUES ('Juan','Perez','Perez','profesor1@profesor.usm.cl','e2236ddc5a2c764f4a3ab5c877bd5a58',0,0);
INSERT INTO Profesor (nombre,apellido1,apellido2,correo,password,coordinador,suspendido) VALUES ('Hernan','Morales','Riquelme','profesor2@profesor.usm.cl','e2236ddc5a2c764f4a3ab5c877bd5a58',0,0);
