export const SQL_QUERIES = {
  FIND_USER_BY_PLAYER_ID: 'SELECT * FROM account WHERE player_id = ?',
  FIND_USER_BY_NAME: 'SELECT * FROM account WHERE name = ?',
  CREATE_USER: 'INSERT INTO account (player_id, pw, name, guild) VALUES (?, ?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE player_id = ?',
  FIND_MONEY_BY_PLAYER_ID: 'SELECT money FROM money WHERE player_id = ?',
  FIND_USER_INVENTORY_BY_PLAYER_ID: 'SELECT * FROM inventory WHERE player_id =?',
  FIND_EQUIPPED_ITEMS_BY_PLAYER_ID: 'SELECT * FROM inventory WHERE player_id = ? AND equipped_items = 1',
  UPDATE_MONEY: 'UPDATE money SET money = ? WHERE player_id = ?',
  CREATE_USER_MONEY: 'INSERT INTO money (player_id, money) VALUES (?, ?)',
  CREATE_INVENTORY: 'INSERT INTO inventory (player_id, item_id, equip_slot) VALUES (?, ?, ?)',
  EQUIP_ITEM: 'UPDATE inventory SET equipped_items = TRUE WHERE player_id = ? AND item_id = ?',
  UNEQUIP_ITEM: 'UPDATE inventory SET equipped_items = FALSE WHERE player_id = ? AND item_id = ?',
  FIND_ITEM_ID_IN_INVENTORY: 'SELECT * FROM inventory where player_id = ? AND item_id=?'
};
