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

export const equipItemPlayerId = async (player_id, item_id) => {
  try {
    await pools.USER_DB.query(SQL_QUERIES.EQUIP_ITEM, [player_id, item_id]);
    return { player_id, item_id };
  } catch (error) {
    console.error(`Error equipping item: ${error.message}`);
    throw error;
  }
};

export const unequipItemPlayerId = async (player_id, item_id) => {
  try {
    await pools.USER_DB.query(SQL_QUERIES.UNEQUIP_ITEM, [player_id, item_id]);
    return { player_id, item_id };
  } catch (error) {
    console.error(`Error unequipping item: ${error.message}`);
    throw error;
  }
};

export const createInventory = async (userConnection, playerId, itemId, equipSlot) => {
  await userConnection.query(SQL_QUERIES.CREATE_INVENTORY, [playerId, itemId, equipSlot]);
  return { playerId, itemId, equipSlot };
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


export const updateUserMoney = async (user_connection, player_id, money) => {
  await user_connection.query(SQL_QUERIES.UPDATE_MONEY, [money, player_id]);
  return { player_id, money };
};

export const gameEndUpdateUserMoney = async (player_id, money) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_MONEY, [money, player_id]);
  return { player_id, money };
};

export const createUserMoney = async (player_id, money) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER_MONEY, [player_id, money]);
  return { player_id, money };
};

export const updateUserInventory = async (user_connection, player_id, item_id, equip_slot) => {
  await user_connection.query(SQL_QUERIES.UPDATE_INVENTORY, [item_id, equip_slot, player_id]);
  return { player_id, item_id, equip_slot };
};

export const purchaseEquipmentTransaction = async (player_id, money, item_id, equip_slot) => {
  const user_connection = await pools.USER_DB.getConnection();
  try {
    await user_connection.beginTransaction();

    await updateUserMoney(user_connection, player_id, money);
    await updateUserInventory(user_connection, player_id, item_id, equip_slot);

    await user_connection.commit();
    console.log('트랜잭션과정 DB저장 성공');
  } catch (err) {
    await user_connection.rollback();
    console.error('트랜잭션과정 DB저장 실패:', err);
    throw err;
  } finally {
    user_connection.release();
  }
};

export const purchaseItemTransaction = async (playerId, newUserMoney, itemId, equipSlot) => {
  const userConnection = await pools.USER_DB.getConnection();
  try {
    await userConnection.beginTransaction();

    await updateUserMoney(userConnection, playerId, newUserMoney);
    await createInventory(userConnection, playerId, itemId, equipSlot);

    await userConnection.commit();
    console.log('트랜잭션과정 DB저장 성공');
  } catch (err) {
    await userConnection.rollback();
    console.error('트랜잭션과정 DB저장 실패:', err);
    throw err;
  } finally {
    userConnection.release();
  }
};
