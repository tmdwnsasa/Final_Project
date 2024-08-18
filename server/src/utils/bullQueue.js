import Queue from 'bull';
import CustomError from './error/customError.js';
import { ErrorCodes } from './error/errorCodes.js';
import { config } from '../config/config.js';
import { getGameSession } from '../sessions/game.session.js';

export const createBullQueue = (id) => {
  const bullQueue = new Queue(id, { redis: config.database.REDIS });

  // 작업 처리
  bullQueue.process((job) => {
    const { gameSessionId, attackUserId, attackedUserId, team } = job.data;

    const gameSession = getGameSession(gameSessionId);

    const attackUser = gameSession.getUser(attackUserId);
    const attackedUser = gameSession.getUser(attackedUserId);

    if (attackedUser.hp <= 0) {
      return;
    }

    if (attackUser.power > attackedUser.hp) {
      attackUser.damage += attackedUser.hp;
      attackedUser.hp = 0;
    }

    if (attackUser.power <= attackedUser.hp) {
      attackedUser.hp -= attackUser.power;
      attackUser.damage += attackUser.power;
    }

    if (attackedUser.hp <= 0) {
      attackUser.kill += 1;
      attackedUser.death += 1;
    }

    return { gameSessionId, playerId: attackedUser.name, hp: attackedUser.hp, team };
  });

  // 결과 처리
  bullQueue.on('completed', (job, result) => {
    if (result) {
      const { gameSessionId, playerId, hp, team } = result;
      const gameSession = getGameSession(gameSessionId);
      gameSession.sendAllAttackedSuccess(playerId, hp, team);
    }
  });

  // 에러 처리
  bullQueue.on('failed', (job, err) => {
    try {
      throw new CustomError(ErrorCodes.BULLQUEUE_ERROR, '불큐 에러');
    } catch (error) {
      handlerError(socket, error);
    }
  });

  return bullQueue;
};
