import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';

const updateSkillHandler = ({ socket, userId, payload }) => {
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

    const startX = user.x + x - rangeX / 2;
    const startY = user.y + y + rangeY / 2;
    const endX = startX + rangeX;
    const endY = startY - rangeY;

    //Latency를 이용한 스킬 판정에 핑 차이 적용
    const maxLatency = gameSession.getMaxLatency();
    setTimeout(() => {
      gameSession.sendAttackedOpposingTeam(user, startX, startY, endX, endY);
    }, maxLatency);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateSkillHandler;
