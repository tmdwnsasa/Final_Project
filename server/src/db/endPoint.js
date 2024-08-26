import { config } from '../config/config.js';

const API_BASE = `http://${config.dbServer.host}:${config.dbServer.port}/api`;

const ENDPOINTS = {
  user: {
    createUser: {
      url: `${API_BASE}/user/createUser`,
      method: 'POST',
    },
    updateUserLogin: {
      url: `${API_BASE}/user/updateUserLogin`,
      method: 'PATCH',
    },
    findUserByPlayerId: {
      url: `${API_BASE}/user/findUserByPlayerId`,
      method: 'GET',
    },
    findMoneyByPlayerId: {
      url: `${API_BASE}/user/findMoneyByPlayerId`,
      method: 'GET',
    },
    updateMoney: {
      url: `${API_BASE}/user/updateMoney`,
      method: 'PATCH',
    },
    findUserInventory: {
      url: `${API_BASE}/user/findUserInventory`,
      method: 'GET',
    },
    findEquippedItems: {
      url: `${API_BASE}/user/findEquippedItems`,
      method: 'GET',
    },
    findItemIdInInventory: {
      url: `${API_BASE}/user/findItemIdInInventory`,
      method: 'GET',
    },
    equipItem: {
      url: `${API_BASE}/user/equipItem`,
      method: 'PATCH',
    },
    unequipItem: {
      url: `${API_BASE}/user/unequipItem`,
      method: 'PATCH',
    },
    purchaseEquipment: {
      url: `${API_BASE}/user/purchaseEquipment`,
      method: 'PATCH',
    },
  },
  game: {
    dbSaveTransaction: {
      url: `${API_BASE}/game/dbSaveTransaction`,
      method: 'POST',
    },
    createCharacter: {
      url: `${API_BASE}/game/createCharacter`,
      method: 'POST',
    },
    createPossession: {
      url: `${API_BASE}/game/createPossession`,
      method: 'POST',
    },
    findPossessionByPlayerID: {
      url: `${API_BASE}/game/findPossessionByPlayerID`,
      method: 'GET',
    },
    findCharacterData: {
      url: `${API_BASE}/game/findCharacterData`,
      method: 'GET',
    },
    findCharacterSkillData: {
      url: `${API_BASE}/game/findCharacterSkillData`,
      method: 'GET',
    },
    findAllItems: {
      url: `${API_BASE}/game/findAllItems`,
      method: 'GET',
    },
    findItemStats: {
      url: `${API_BASE}/game/findItemStats`,
      method: 'GET',
    },
    findCharacterInfo: {
      url: `${API_BASE}/game/findCharacterInfo`,
      method: 'GET',
    },
    updatePossession: {
      url: `${API_BASE}/game/updatePossession`,
      method: 'PATCH',
    },
    purchaseCharacter: {
      url: `${API_BASE}/game/purchaseCharacter`,
      method: 'PATCH',
    },
  },
  db: {
    resetAllSchema: {
      url: `${API_BASE}/db/resetAllSchema`,
      method: 'PUT',
    },
  },
};

export default ENDPOINTS;
