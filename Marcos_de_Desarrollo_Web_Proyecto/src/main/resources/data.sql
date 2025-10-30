-- Le decimos a MySQL que use tu base de datos
USE peeps_db;

-- Borramos la tabla CADA VEZ que arranca, para empezar de cero (perfecto para desarrollo)
DROP TABLE IF EXISTS canciones;

-- Creamos la tabla (JPA también lo hace, pero esto es más explícito)
CREATE TABLE canciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    artista VARCHAR(255),
    cover VARCHAR(255),
    src VARCHAR(255)
);

-- ---------------------------------
-- INSERTAMOS TODAS LAS CANCIONES
-- ---------------------------------
INSERT INTO canciones (titulo, artista, cover, src) VALUES 
('AM Remix', 'Nio Garcia x J Balvin x Bad Bunny', '/images/AM Remix.jpg', '/audio/AM Remix.mp3'),
('Bohemian Rhapsody', 'Queen', '/images/Bohemian Rhapsody.jpg', '/audio/Bohemian Rhapsody.mp3'),
('cabellos blancos', 'Carmencita Lara', '/images/cabellos blancos.jpg', '/audio/cabellos blancos.mp3'),
('carta al cielo', 'Lucha Reyes', '/images/carta al cielo.jpg', '/audio/carta al cielo.mp3'),
('Chillax', 'Farruko', '/images/Chillax.jpg', '/audio/Chillax.mp3'),
('Con Altura', 'J Balvin x Rosalía', '/images/Con Altura.jpg', '/audio/Con Altura.mp3'),
('Dakiti', 'Bad Bunny', '/images/Dakiti.jpg', '/audio/Dakiti.mp3'),
('Despechá', 'Rosalia', '/images/Despechá.jpg', '/audio/Despechá.mp3'),
('DtMF', 'Bad Bunny', '/images/DtMF.jpg', '/audio/DtMF.mp3'),
('Ella y Yo', 'Aventura (Ft. Don Omar)', '/images/Ella y Yo.jpg', '/audio/Ella y Yo.mp3'),
('Felices los 4', 'Maluma', '/images/Felices los 4.jpg', '/audio/Felices los 4.mp3'),
('Hawái', 'Maluma', '/images/Hawái.jpg', '/audio/Hawái.mp3'),
('La Alergia', 'Donny Caballero', '/images/La Alergia.jpg', '/audio/La Alergia.mp3'),
('La Botella', 'Justin Quiles & Maluma', '/images/La Botella.jpg', '/audio/La Botella.mp3'),
('La Cancion', 'Bad Bunny & J Balvin', '/images/La Canción.jpg', '/audio/La Canción.mp3'),
('Lo Pasado, Pasado', 'José José', '/images/Lo Pasado, Pasado.jpg', '/audio/Lo Pasado, Pasado.mp3'),
('Me Porto Bonito', 'Bad Bunny', '/images/Me Porto Bonito.jpg', '/audio/Me Porto Bonito.mp3'),
('Me Rehúso', 'Danny Ocean', '/images/Me Rehúso.jpg', '/audio/Me Rehúso.mp3'),
('Monotonía', 'Shakira', '/images/Monotonía.jpg', '/audio/Monotonía.mp3'),
('Ojitos Lindos', 'Bad Bunny & Bomba Estéreo', '/images/Ojitos Lindos.jpg', '/audio/Ojitos Lindos.mp3'),
('Otro Trago', 'Darell & Sech', '/images/Otro Trago.jpg', '/audio/Otro Trago.mp3'),
('Pa Mi (Remix)', 'Alex, Dimelo Flow & Rafa Pabón', '/images/Pa Mi (Remix).jpg', '/audio/Pa Mi (Remix).mp3'),
('Pareja del Año', 'Myke Towers & Sebastián Yatra', '/images/Pareja del Año.jpg', '/audio/Pareja del Año.mp3'),
('Qué Más Pues', 'J Balvin & Maria Becerra', '/images/Qué Más Pues.jpg', '/audio/Qué Más Pues.mp3'),
('Salió el Sol', 'Don Omar', '/images/Salió el Sol.jpg', '/audio/Salió el Sol.mp3'),
('Sunset', 'Farruko', '/images/Sunset.jpg', '/audio/Sunset.mp3'),
('Tacones Rojos', 'Sebastián Yatra', '/images/Tacones Rojos.jpg', '/audio/Tacones Rojos.mp3'),
('Tal Vez', 'Paulo Londra', '/images/Tal Vez.jpg', '/audio/Tal Vez.mp3'),
('Tití Me Preguntó', 'Bad Bunny', '/images/Tití Me Preguntó.jpg', '/audio/Tití Me Preguntó.mp3'),
('Todo De Ti', 'Rauw Alejandro', '/images/Todo De Ti.jpg', '/audio/Todo De Ti.mp3'),
('Volví', 'Aventura & Bad Bunny', '/images/Volví.jpg', '/audio/Volví.mp3');