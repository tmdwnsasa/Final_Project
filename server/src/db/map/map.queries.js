export const MAP_SQL_QUERIES = {
  INSERT_MAP: 'INSERT INTO map_data (map_name, is_disputed_area, owned_by) VALUES (?, ?, ?)',
  FIND_MAP_DATA: 'SELECT * FROM map_data',
  UPDATE_GREEN_WIN_COUNT: 'UPDATE map_data SET count_blue_win = ? WHERE map_id = ?',
  UPDATE_BLUE_WIN_COUNT: 'UPDATE map_data SET count_red_win = ? WHERE map_id = ?',
  CHANGING_OWNER: 'UPDATE map_data SET is_disputed_area = ?, owned_by = ?'
};
