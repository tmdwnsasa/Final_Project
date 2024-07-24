CREATE TABLE IF NOT EXISTS score
(
    player_id VARCHAR(36) PRIMARY KEY,
    score INT
);

CREATE TABLE IF NOT EXISTS rating
(
    player_id VARCHAR(36),
    character_id INT,
    win INT,
    lose INT,
    PRIMARY KEY(player_id, character_id)
);

CREATE TABLE IF NOT EXISTS possession
(
    possession_id INT PRIMARY KEY,
    player_id VARCHAR(36),
    character_id INT
);

CREATE TABLE IF NOT EXISTS match_log
(
    game_session_id VARCHAR(255) PRIMARY KEY,
    red_player1_id VARCHAR(36),
    red_player2_id VARCHAR(36),
    blue_player1_id VARCHAR(36),
    blue_player2_id VARCHAR(36),
    winner_team VARCHAR(36),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_history
(
    game_session_id VARCHAR(255),
    player_id VARCHAR(36),
    `kill` INT,
    death INT,
    damage INT,
    PRIMARY KEY(game_session_id, player_id)
);