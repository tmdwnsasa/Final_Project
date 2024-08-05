import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';
import { getUserById } from '../../sessions/user.session.js';

const updateSkillHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y, rangeX, rangeY } = payload;
    //임시로 사용함
    const gameSession = getGameSessionByPlayerId(userId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다');
    }
    gameSession.updateAttack(user.name, x, y, rangeX, rangeY);

    const startX = x - rangeX / 2;
    const startY = y - rangeY / 2;
    const endX = startX + rangeX;
    const endY = startY + rangeY;

    gameSession.getOpposingTeam(user, startX, startY, endX, endY);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateSkillHandler;
