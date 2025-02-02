CREATE DATABASE IF NOT EXISTS USER_DB;
USE USER_DB;

CREATE TABLE IF NOT EXISTS account (
    player_id  VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    guild INT NOT NULL,
    create_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS money (
    player_id VARCHAR(255) PRIMARY KEY,
    money INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES account(player_id)
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(255),
    item_id INT,
    equipped_items BOOLEAN DEFAULT FALSE,
    equip_slot VARCHAR(255),
    FOREIGN KEY(player_id) REFERENCES account(player_id)
);

PARTITION BY LIST (CHAR_LENGTH(player_id))(
    PARTITION pID_1 VALUES IN (2,3),
    PARTITION pID_2 VALUES IN (4,5,6)
);

CREATE INDEX idx_itemId ON inventory (item_id);




