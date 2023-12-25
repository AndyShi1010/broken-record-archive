DROP TABLE IF EXISTS songs;

CREATE TABLE songs (
	id int NOT NULL PRIMARY KEY,
	song_title text NOT NULL,
	notes varchar NOT NULL
);

INSERT INTO songs (id, song_title, notes)
VALUES (1, 'Ode to Joy (Dubstep Remix)', 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4');
INSERT INTO songs (id, song_title, notes)
VALUES (2, '12 Bar Blues (Bb)', 'Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Eb5 Eb5 Eb5 Eb5 Eb5 Eb5 Eb5 Eb5 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 F5 F5 F5 F5 Eb5 Eb5 Eb5 Eb5 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4 Bb4');
INSERT INTO songs (id, song_title, notes)
VALUES (3, 'Sandstorm - Darude', 'B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 E6 E6 E6 E6 E6 E6 E6 D6 D6 D6 D6 D6 D6 D6 A5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 E6 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 B5 D6');
INSERT INTO songs (id, song_title, notes)
VALUES (4, 'Megalovania', 'D4 D4 D5 A4 Ab4 G4 F4 D4 F4 G4');
INSERT INTO songs (id, song_title, notes)
VALUES (5, 'Shiny Smiley Story', 'Eb4 F4 G4 Ab4 G4 Eb4 Ab4 Bb4 Eb4 Ab4 G4 G4 G4 Bb4 C5');
