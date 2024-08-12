CREATE TABLE IF NOT EXISTS map_data
(
    map_id INT AUTO_INCREMENT PRIMARY KEY,
    map_name VARCHAR(36) UNIQUE,
    is_disputed_area BOOLEAN,
    owned_by VARCHAR(36) NULL
)