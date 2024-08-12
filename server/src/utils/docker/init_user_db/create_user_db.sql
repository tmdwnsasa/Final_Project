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

//인벤토리 테이블 추가
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(255),
    item_id INT,
    quantity INT,
    equipped_items BOOLEAN DEFAULT FALSE,
    slot VARCHAR(255),
    FOREIGN KEY(player_id) REFERENCES account(player_id),
    FOREIGN KEY(item_id) REFERENCES game_db.Items(item_id)
);
