CREATE TABLE IF NOT EXISTS account
(
    player_id  VARCHAR(255) PRIMARY KEY,
    pw         VARCHAR(255) UNIQUE NOT NULL,
    name       VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS money (
    player_id VARCHAR(255) PRIMARY KEY,
    money INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES account(player_id)
);