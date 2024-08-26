CREATE TABLE IF NOT EXISTS map_data
(
    map_id INT AUTO_INCREMENT PRIMARY KEY,
    map_name VARCHAR(36) UNIQUE,
    is_disputed_area BOOLEAN,
    owned_by VARCHAR(36) NULL,
    count_blue_win VARCHAR(36) DEFAULT 0,
    count_green_win VARCHAR(36) DEFAULT 0,
    count INT DEFAULT 3
);