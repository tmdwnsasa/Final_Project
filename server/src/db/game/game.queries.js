export const GAME_SQL_QUERIES = {
  // FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  // CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  // UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  // UPDATE_USER_LOCATION: 'UPDATE user SET x = ?, y = ? WHERE device_id = ?',
  CREATE_MATCH_HISTORY:
    'INSERT INTO match_history (game_session_id, player_id, `kill`, death, damage) VALUES(?, ?, ?, ?, ?)',
  CREATE_MATCH_LOG:
    'INSERT INTO match_log (game_session_id, red_player1_id, red_player2_id, blue_player1_id , blue_player2_id, winner_team, start_time, end_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
  FIND_POSSESSION_BY_PLAYER_ID: 'SELECT * FROM possession WHERE player_id = ?',
  CREATE_POSSESSION: 'INSERT INTO possession (player_id, character_id) VALUES(?, ?)',
  CREATE_USER_SCORE: 'INSERT INTO score (player_id, score) VALUES(?, ?)',
  CREATE_USER_RATING: 'INSERT INTO rating (player_id, character_id, win, lose) VALUES(?, ?, ?, ?)',
  UPDATE_USER_SCORE: 'UPDATE score SET score = ? WHERE player_id = ?',
  UPDATE_USER_RATING: 'UPDATE rating SET win = ?, lose = ? WHERE player_id = ? AND character_id = ?',
  FIND_USER_SCORE_BY_PLAYER_ID: 'SELECT * FROM score WHERE player_id = ?',
  FIND_USER_RATING_BY_PLAYER_ID: 'SELECT * FROM rating WHERE player_id = ?',
  CREATE_CHARACTER:
    'INSERT INTO `character` (character_name, hp, speed, power, defense, critical, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
  CREATE_CHARACTER_SKILLS:
    'INSERT INTO character_skills (skill_name, skill_type, character_id, damage_factor, cool_time, `range`, `scale`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    FIND_CHARACTERS_DATA: 'SELECT character_id, character_name, hp, speed, power, defense, critical, price FROM character',

  };