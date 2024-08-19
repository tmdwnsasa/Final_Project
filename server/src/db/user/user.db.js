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

export const createUser = async (player_id, pw, name, guild) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [player_id, pw, name, guild]);
  return { player_id, pw, name, guild };
};

export const updateUserLogin = async (player_id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [player_id]);
};

export const findMoneyByPlayerId = async (player_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_MONEY_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const findUserInventoryItemsByPlayerId = async (player_id) => {
  const rows = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_INVENTORY_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const findEquippedItemsByPlayerId = async (player_id) => {
  const rows = await pools.USER_DB.query(SQL_QUERIES.FIND_EQUIPPED_ITEMS_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const equipItem = async (player_id, item_id, equipped_items) => {
  try {
    await pools.USER_DB.query(SQL_QUERIES.EQUIP_ITEM, [equipped_items, player_id, item_id]);
    return { player_id, item_id, equipped_items };
  } catch (error) {
    console.error(`Error equipping item: ${error.message}`);
    throw error;
  }
};

export const unequipItem = async (player_id, item_id, equipped_items) => {
  try {
    await pools.USER_DB.query(SQL_QUERIES.UNEQUIP_ITEM, [player_id, item_id, equipped_items]);
    return { player_id, item_id, equipped_items };
  } catch (error) {
    console.error(`Error unequipping item: ${error.message}`);
    throw error;
  }
};

export const updateUserMoney = async (userConnection, playerId, userMoney) => {
  await userConnection.query(SQL_QUERIES.UPDATE_MONEY, [userMoney, playerId]);
  return { playerId, userMoney };
};

export const gameEndUpdateUserMoney = async (playerId, userMoney) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_MONEY, [userMoney, playerId]);
  return { playerId, userMoney };
};

export const createUserMoney = async (playerId, money) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER_MONEY, [playerId, money]);
  return { playerId, money };
};
