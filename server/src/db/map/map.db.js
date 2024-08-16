import { toCamelCase } from '../../utils/transformCase.js';
import pools from '../database.js';
import { MAP_SQL_QUERIES } from './map.queries.js';

export const insertMap = async (map_name, is_disputed_area, owned_by) => {
  await pools.MAP_DB.query(MAP_SQL_QUERIES.INSERT_MAP, [map_name, is_disputed_area, owned_by]);
};

export const findMapData = async () => {
  const rows = await pools.MAP_DB.query(MAP_SQL_QUERIES.FIND_MAP_DATA);
  return toCamelCase(rows[0]);
};
