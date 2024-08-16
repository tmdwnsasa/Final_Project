import { config } from '../config/config.js';

const API_BASE = `http://${config.dbServer.host}:${config.dbServer.port}/api`;

const ENDPOINTS = {
  user: {
    createUser: `${API_BASE}/user/createUser`,
    updateUserLogin: `${API_BASE}/user/updateUserLogin`,
    findUserByPlayerId: `${API_BASE}/user/findUserByPlayerId`,
    findMoneyByPlayerId: `${API_BASE}/user/findMoneyByPlayerId`,
  },
  game: {
    createMatchHistory: `${API_BASE}/game/createMatchHistory`,
    createMatchLog: `${API_BASE}/game/createMatchLog`,
    createUserScore: `${API_BASE}/game/createUserScore`,
    createUserRating: `${API_BASE}/game/createUserRating`,
    getUserScore: `${API_BASE}/game/getUserScore`,
    updateUserRating: `${API_BASE}/game/updateUserRating`,
    createCharacter: `${API_BASE}/game/createCharacter`,
    getUserRating: `${API_BASE}/game/getUserRating`,
    createPossession: `${API_BASE}/game/createPossession`,
    findPossessionByPlayerID: `${API_BASE}/game/findPossessionByPlayerID`,
    findCharacterData: `${API_BASE}/game/findCharacterData`,
    findCharacterInfo: `${API_BASE}/game/findCharacterInfo`,
    updatePossession: `${API_BASE}/game/updatePossession`,
  },
  db: {
    resetAllSchema: `${API_BASE}/db/resetAllSchema`,
  },
};

export default ENDPOINTS;
