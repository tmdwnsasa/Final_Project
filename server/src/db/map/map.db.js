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

export const updateBlueWinCount = async (winCount, mapId) => {
  await pools.MAP_DB.query(MAP_SQL_QUERIES.UPDATE_BLUE_WIN_COUNT, [winCount, mapId]);
}

export const updateGreenWinCount = async (winCount, mapId) => {
  await pools.MAP_DB.query(MAP_SQL_QUERIES.UPDATE_GREEN_WIN_COUNT, [winCount, mapId]);
}

export const changingOwner = async (isDisputedArea, ownedBy, mapId) => {
  await pools.MAP_DB.query(MAP_SQL_QUERIES.CHANGING_OWNER, [isDisputedArea, ownedBy, mapId]);
}

export const updateCount = async (mapId) => {
  await pools.MAP_DB.query(MAP_SQL_QUERIES.UPDATE_COUNT, [mapId]);
}