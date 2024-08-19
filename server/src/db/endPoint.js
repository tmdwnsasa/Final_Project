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
    createUserMoney: {
      url: `${API_BASE}/user/createUserMoney`,
      method: 'POST',
    },
    findMoneyByPlayerId: {
      url: `${API_BASE}/user/findMoneyByPlayerId`,
      method: 'GET',
    },
    updateMoney: {
      url: `${API_BASE}/user/updateMoney`,
      method: 'PATCH',
    },
  },
  game: {
    createMatchHistory: {
      url: `${API_BASE}/game/createMatchHistory`,
      method: 'POST',
    },
    createMatchLog: {
      url: `${API_BASE}/game/createMatchLog`,
      method: 'POST',
    },
    createUserScore: {
      url: `${API_BASE}/game/createUserScore`,
      method: 'POST',
    },
    createUserRating: {
      url: `${API_BASE}/game/createUserRating`,
      method: 'POST',
    },
    getUserScore: {
      url: `${API_BASE}/game/getUserScore`,
      method: 'GET',
    },
    updateUserRating: {
      url: `${API_BASE}/game/updateUserRating`,
      method: 'PATCH',
    },
    createCharacter: {
      url: `${API_BASE}/game/createCharacter`,
      method: 'POST',
    },
    getUserRating: {
      url: `${API_BASE}/game/getUserRating`,
      method: 'GET',
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
    findCharacterInfo: {
      url: `${API_BASE}/game/findCharacterInfo`,
      method: 'GET',
    },
    updatePossession: {
      url: `${API_BASE}/game/updatePossession`,
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
