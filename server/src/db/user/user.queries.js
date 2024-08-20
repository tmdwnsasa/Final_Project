export const SQL_QUERIES = {
  FIND_USER_BY_PLAYER_ID: 'SELECT * FROM account WHERE player_id = ?',
  FIND_USER_BY_NAME: 'SELECT * FROM account WHERE name = ?',
  CREATE_USER: 'INSERT INTO account (player_id, pw, name, guild) VALUES (?, ?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE player_id = ?',
  FIND_MONEY_BY_PLAYER_ID: 'SELECT money FROM money WHERE player_id = ?',
  FIND_USER_INVENTORY_BY_PLAYER_ID: 'SELECT * FROM inventory WHERE player_id =?',
  FIND_EQUIPPED_ITEMS_BY_PLAYER_ID: 'SELECT * FROM inventory WHERE player_id = ? AND equipped_items = 1',
  EQUIP_ITEM_TO_PLAYER_ID: 'UPDATE inventory SET equipped_items = TRUE, equip_slot = ? WHERE player_id = ? AND item_id = ?',
  UNEQUIP_ITEM_TO_PLAYER_ID: 'UPDATE inventory SET equipped_items = FALSE, equip_slot = NULL WHERE player_id = ? AND item_id = ? AND equip_slot = ?',
  UPDATE_MONEY:'UPDATE money SET money = ? WHERE player_id = ?',
  CREATE_USER_MONEY: 'INSERT INTO money (player_id, money) VALUES (?, ?)',
  UPDATE_USER_INVENTORY: 'UPDATE inventory SET equip_slot = ?, equipped_items = FALSE WHERE player_id = ? AND item_id = ?'
};
