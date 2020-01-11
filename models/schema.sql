DROP DATABASE IF EXISTS movie_mood;
CREATE DATABASE movie_mood;

use movie_mood;

CREATE TABLE moods
(
    id INT
    AUTO_INCREMENT NOT NULL,
    mood VARCHAR
    (255) NOT NULL,
    genre_id VARCHAR
    (255) NOT NULL,
    PRIMARY KEY
    (id)
);
