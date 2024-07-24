export const SQL_QUERIES = {
    FIND_USER_BY_PLAYER_ID: 'SELECT * FROM user WHERE player_id = ?',
    CREATE_USER: 'INSERT INTO user (player_id, pw, name) VALUES (?, ?, ?)',
    UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE player_id = ?',
    FIND_MONEY_BY_PLAYER_ID: 'SELECT money FROM money WHERE player_id = ?',
}