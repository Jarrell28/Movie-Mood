DROP DATABASE IF EXISTS project2;
CREATE DATABASE project2;

use project2;

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
