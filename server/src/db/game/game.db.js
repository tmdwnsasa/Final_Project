import pools from '../database.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { GAME_SQL_QUERIES } from './game.queries.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { asyncSaveScoreRating, saveMatchHistory } from '../../utils/gameEnd.js';

export const createMatchHistory = async (connection, sessionId, playerId, kill, death, damage) => {
  await connection.query(GAME_SQL_QUERIES.CREATE_MATCH_HISTORY, [sessionId, playerId, kill, death, damage]);
  return { sessionId, playerId, kill, death, damage };
};

export const createMatchLog = async (
  connection,
  sessionId,
  redPlayer1Id,
  redPlayer2Id,
  bluePlayer1Id,
  bluePlayer2Id,
  winTeam,
  startTime,
) => {
  const endTime = Date.now();
  await connection.query(GAME_SQL_QUERIES.CREATE_MATCH_LOG, [
    sessionId,
    redPlayer1Id,
    redPlayer2Id,
    bluePlayer1Id,
    bluePlayer2Id,
    winTeam,
    formatDate(new Date(startTime)),
    formatDate(new Date(endTime)),
  ]);
  console.log(`${sessionId}매치로그 저장 완료`);
  return { sessionId, redPlayer1Id, redPlayer2Id, bluePlayer1Id, bluePlayer2Id, winTeam, endTime };
};

export const createUserScore = async (connection, playerId, score) => {
  await connection.query(GAME_SQL_QUERIES.CREATE_USER_SCORE, [playerId, score]);
  return { playerId, score };
};

export const createUserRating = async (connection, playerId, characterId, win, lose) => {
  await connection.query(GAME_SQL_QUERIES.CREATE_USER_RATING, [playerId, characterId, win, lose]);
  return { playerId, characterId, win, lose };
};

export const updateUserScore = async (connection, playerId, score) => {
  await connection.query(GAME_SQL_QUERIES.UPDATE_USER_SCORE, [score, playerId]);
  return { playerId, score };
};

export const updateUserRating = async (connection, playerId, characterId, win, lose) => {
  await connection.query(GAME_SQL_QUERIES.UPDATE_USER_RATING, [win, lose, playerId, characterId]);
  return { playerId, characterId, win, lose };
};

export const findUserScoreTable = async (connection, playerId) => {
  const [rows] = await connection.query(GAME_SQL_QUERIES.FIND_USER_SCORE_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0]);
};

export const getUserScore = async (connection, playerId) => {
  const [rows] = await connection.query(GAME_SQL_QUERIES.FIND_USER_SCORE_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0].score);
};

export const getUserRating = async (connection, playerId) => {
  const [rows] = await connection.query(GAME_SQL_QUERIES.FIND_USER_RATING_BY_PLAYER_ID, [playerId]);
  return toCamelCase(rows[0]);
};

export const createCharacter = async (characterName, hp, speed, power, defense, critical, price) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_CHARACTER, [
    characterName,
    hp,
    speed,
    power,
    defense,
    critical,
    price,
  ]);
};

export const createCharacterSkill = async (skillName, skillType, characterId, damageFactor, coolTime, range, scale) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_CHARACTER_SKILLS, [
    skillName,
    skillType,
    characterId,
    damageFactor,
    coolTime,
    range,
    scale,
  ]);
};

export const findPossessionByPlayerID = async (player_id) => {
  const rows = await pools.GAME_DB.query(GAME_SQL_QUERIES.FIND_POSSESSION_BY_PLAYER_ID, [player_id]);
  return toCamelCase(rows[0]);
};

export const createPossession = async (player_id, character_id) => {
  await pools.GAME_DB.query(GAME_SQL_QUERIES.CREATE_POSSESSION, [player_id, character_id]);
  return { player_id, character_id };
};

export async function dbSaveTransaction(winTeam, loseTeam, users, gameSession, winnerTeam, startTime) {
  const connection = await pools.GAME_DB.getConnection();
  try {
    await connection.beginTransaction();

    await asyncSaveScoreRating(connection, winTeam, loseTeam);
    await saveMatchHistory(connection, users, gameSession.sessionId);
    await createMatchLog(
      connection,
      gameSession.sessionId,
      winTeam[0].playerId,
      winTeam[1].playerId,
      loseTeam[0].playerId,
      loseTeam[1].playerId,
      winnerTeam,
      startTime,
    );

    await connection.commit();
    console.log('트랜잭션과정 DB저장 성공');
  } catch (err) {
    await connection.rollback();
    console.error('트랜잭션과정 DB저장 실패:', err);
    throw err;
  } finally {
    connection.release();
  }
}
