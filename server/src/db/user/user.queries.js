export const SQL_QUERIES = {
  FIND_USER_BY_PLAYER_ID: 'SELECT * FROM account WHERE player_id = ?',
  FIND_USER_BY_NAME: 'SELECT * FROM account WHERE name = ?',
  CREATE_USER: 'INSERT INTO account (player_id, pw, name) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE player_id = ?',
  FIND_MONEY_BY_PLAYER_ID: 'SELECT money FROM money WHERE player_id = ?',
  FIND_USER_INVENTORY_BY_PLAYER_ID: 'SELECT * FROM inventory WHERE player_id =?',
  FIND_EQUIPPED_ITEMS_BY_PLAYER_ID: 'SELECT * FROM equipped_items WHERE player_id?',
  EQUIP_ITEM: 'UPDATE inventory SET equipped_items = TRUE, slot = ? WHERE player_id = ? AND item_id = ?',
  UNEQUIP_ITEM: 'UPDATE inventory SET equipped_items = FALSE, slot = NULL WHERE player_id = ? AND slot = ?'
  
};
