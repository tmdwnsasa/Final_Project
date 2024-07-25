export const GAME_SQL_QUERIES = {
  // FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  // CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  // UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  // UPDATE_USER_LOCATION: 'UPDATE user SET x = ?, y = ? WHERE device_id = ?',
  CREATE_MATCH_HISTORY:
    'INSERT INTO match_history (game_session_id, player_id, kill, death, damage) VALUES(?, ?, ?, ?, ?)',
  CREATE_MATCH_LOG:
    'INSERT INTO match_log (game_session_id, red_player1_id, red_player2_id, blue_player1_id , blue_player2_id, winner_team, start_time, end_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
};
