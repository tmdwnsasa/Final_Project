export const MAP_SQL_QUERIES = {
  INSERT_MAP: 'INSERT INTO map_data (map_name, is_disputed_area, owned_by) VALUES (?, ?, ?)',
  FIND_MAP_DATA: 'SELECT * FROM map_data'
};
