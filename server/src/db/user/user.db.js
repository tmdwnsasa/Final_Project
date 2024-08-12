import { toCamelCase } from '../../utils/transformCase.js';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';

export const findUserByPlayerId = async (player_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const findUserByName = async (name) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_NAME, [name]);
  return toCamelCase(rows[0]);
};

export const createUser = async (player_id, pw, name) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [player_id, pw, name]);
  return { player_id, pw, name };
};

export const updateUserLogin = async (player_id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [player_id]);
};

export const findMoneyByPlayerId = async (player_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_MONEY_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const findUserInventoryByPlayerId = async (player_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_INVENTORY_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows);
};

export const findEquippedItemsByPlayerId = async (player_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_EQUIPPED_ITEMS_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows);
};

export const equipItem = async (player_id, item_id, slot) => {
  await pools.USER_DB.query(SQL_QUERIES.EQUIP_ITEM, [slot, player_id, item_id]);
  return { player_id, item_id, slot };
};

export const unequipItem = async (player_id, slot) => {
  await pools.USER_DB.query(SQL_QUERIES.UNEQUIP_ITEM, [player_id, slot]);
  return { player_id, slot };
};
