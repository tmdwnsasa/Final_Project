CREATE DATABASE IF NOT EXISTS GAME_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE GAME_DB;

CREATE TABLE IF NOT EXISTS score (
    player_id VARCHAR(36) PRIMARY KEY,
    score INT NOT NULL
);

CREATE TABLE IF NOT EXISTS rating (
    player_id VARCHAR(36),
    character_id INT,
    win INT,
    lose INT,
    PRIMARY KEY (player_id, character_id)
);

CREATE TABLE IF NOT EXISTS possession (
    possession_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(36),
    character_id INT
);

CREATE TABLE IF NOT EXISTS match_log (
    game_session_id VARCHAR(255) PRIMARY KEY,
    red_player1_id VARCHAR(36),
    red_player2_id VARCHAR(36),
    blue_player1_id VARCHAR(36),
    blue_player2_id VARCHAR(36),
    winner_team VARCHAR(36),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_history (
    game_session_id VARCHAR(255),
    player_id VARCHAR(36),
    `kill` INT,
    death INT,
    damage INT,
    PRIMARY KEY(game_session_id, player_id)
);

CREATE TABLE IF NOT EXISTS `character` (
    character_id INT AUTO_INCREMENT PRIMARY KEY,
    character_name VARCHAR(255), 
    hp INT NOT NULL,
    speed INT NOT NULL,
    power INT NOT NULL,
    defense FLOAT NOT NULL,
    critical FLOAT NOT NULL,
    price INT NOT NULL
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;

CREATE TABLE IF NOT EXISTS character_skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255),
    skill_type INT,
    character_id INT,
    damage_factor FLOAT NULL,
    cool_time INT,
    `range` INT NULL,
    `scale` INT NULL,
    FOREIGN KEY (character_id) REFERENCES `character`(character_id)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 근씨 아저씨
INSERT INTO `character` (character_name, hp, speed, power, defense, critical, price) VALUES ('근씨 아저씨', 150, 5, 10, 0.1, 0.05, 5000);

-- 원씨 아줌마
INSERT INTO `character` (character_name, hp, speed, power, defense, critical, price) VALUES ('원씨 아줌마', 100, 4, 12, 0.08, 0.1, 5000);

-- 힐씨 아줌마
INSERT INTO `character` (character_name, hp, speed, power, defense, critical, price) VALUES ('힐씨 아줌마', 80, 5, 7, 0.09, 0, 5000);

-- 탱씨 아저씨
INSERT INTO `character` (character_name, hp, speed, power, defense, critical, price) VALUES ('탱씨 아저씨', 200, 4, 8, 0.15, 0.05, 5000);

-- 근씨 아저씨 스킬들
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('괭이질', 1, 1, 1, 1, NULL, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('대쉬', 3, 1, NULL, 10, 4, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('광폭화', 4, 1, NULL, 30, NULL, NULL);

-- 원씨 아줌마 스킬들
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('씨 뿌리기', 2, 2, 1, 1, NULL, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('불장판', 5, 2, 2, 15, 15, 10);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('궁극기', 6, 2, 0.2, 30, 20, NULL);

-- 힐씨 아줌마 스킬들
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('물 뿌리기', 2, 3, 1, 1, NULL, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('새참', 5, 3, 1, 5, 10, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('부활', 6, 3, NULL, 50, 1, NULL);

-- 탱씨 아저씨 스킬들
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('삽질', 1, 4, 1, 1, 1, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('방패막기', 7, 4, NULL, 5, NULL, NULL);
INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES ('궁극기', 5, 4, 0.2, 30, 1, 30);