CREATE DATABASE IF NOT EXISTS USER_DB;
USE USER_DB;

CREATE TABLE IF NOT EXISTS account (
    player_id  VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
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
    item_sprite_name VARCHAR(255),
    equipped_items BOOLEAN DEFAULT FALSE,
    equip_slot VARCHAR(255),
    slot_id INT,  
    FOREIGN KEY(player_id) REFERENCES account(player_id)
);