import pools from '../database.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { GAME_SQL_QUERIES } from './game.queries.js';


export const createMatchHistory = async (sessionId, id, kill, death, damage) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_MATCH_HISTORY, [sessionId, id, kill, death, damage]);
  return { id, kill, death, damage };
};

export const createMatchLog = async (sessionId, redPlayer1Id, redPlayer2Id, bluePlayer1Id, bluePlayer2Id, winTeam, startTime) => {
  const endTime = Date.now();
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_MATCH_LOG, [
    sessionId,
    redPlayer1Id,
    redPlayer2Id,
    bluePlayer1Id,
    bluePlayer2Id,
    winTeam,
    startTime,
    endTime,
  ]);
  return { redPlayer1Id, redPlayer2Id, bluePlayer1Id, bluePlayer2Id, winTeam, endTime };
};
