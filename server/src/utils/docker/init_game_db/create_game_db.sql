CREATE DATABASE IF NOT EXISTS GAME_DB;
USE GAME_DB;

CREATE TABLE score (
    player_id INT PRIMARY KEY,
    score INT NOT NULL
);

CREATE TABLE rating (
    player_id INT,
    character_id INT,
    win INT,
    lose INT,
    PRIMARY KEY (player_id, character_id)
);

CREATE TABLE possession (
    possession_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    character_id INT
);

CREATE TABLE character (
    character_id INT AUTO_INCREMENT PRIMARY KEY,
    character_name VARCHAR(255), 
    hp INT NOT NULL,
    speed INT NOT NULL,
    power INT NOT NULL,
    defense INT NOT NULL,
    critical INT NOT NULL,
    price INT NOT NULL
);

CREATE TABLE character_skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255), 
    character_id INT,
    damage INT,
    cool_time INT NOT NULL,
    FOREIGN KEY (character_id) REFERENCES character(character_id)
);
