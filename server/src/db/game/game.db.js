import pools from '../database.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { GAME_SQL_QUERIES } from './game.queries.js';
import { formatDate } from '../../utils/dateFormatter.js';

export const createMatchHistory = async (sessionId, playerId, kill, death, damage) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_MATCH_HISTORY, [sessionId, playerId, kill, death, damage]);
  return { sessionId, playerId, kill, death, damage };
};

export const createMatchLog = async (
  sessionId,
  redPlayer1Id,
  redPlayer2Id,
  bluePlayer1Id,
  bluePlayer2Id,
  winTeam,
  startTime
) => {
  const endTime = Date.now();
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_MATCH_LOG, [
    sessionId,
    redPlayer1Id,
    redPlayer2Id,
    bluePlayer1Id,
    bluePlayer2Id,
    winTeam,
    formatDate(new Date(startTime)),
    formatDate(new Date(endTime)),
  ]);
  return { sessionId, redPlayer1Id, redPlayer2Id, bluePlayer1Id, bluePlayer2Id, winTeam, endTime };
};

export const createUserScore = async (playerId, score) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_USER_SCORE, [playerId, score]);
  return { playerId, score };
};

export const createUserRating = async (playerId, characterId, win, lose) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_USER_RATING, [playerId, characterId, win, lose]);
  return { playerId, characterId, win, lose };
};

export const updateUserScore = async (playerId, score) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.UPDATE_USER_SCORE, [score, playerId]);
  return { playerId, score };
};

export const updateUserRating = async (playerId, characterId, win, lose) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.UPDATE_USER_RATING, [win, lose, playerId, characterId]);
  return { playerId, characterId, win, lose };
};

export const findUserScoreTable = async (playerId) => {
  const [rows] = await pools.GAME_DB.query(GAME_SQL_QUERIES.FIND_USER_SCORE_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0]);
};

export const findUserRatingTable = async (playerId) => {
  const [rows] = await pools.GAME_DB.query(GAME_SQL_QUERIES.FIND_USER_RATING_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0]);
};

export const getUserScore = async (playerId) => {
  const [rows] = await pools.GAME_DB.query(GAME_SQL_QUERIES.FIND_USER_SCORE_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0].score);
};

export const getUserRating = async (playerId) => {
  const [rows] = await pools.GAME_DB.query(GAME_SQL_QUERIES.FIND_USER_RATING_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0]);
};
