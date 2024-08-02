import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getAllGameSessions } from '../../sessions/game.session.js';

const updateSkillHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y, rangeX, rangeY } = payload;
    //임시로 사용함
    const gameSession = getAllGameSessions()[0];

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    const existUser = gameSession.getUser(user.id);
    if (!existUser) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다');
    }

    gameSession.updateAttack(existUser.name, x, y, rangeX, rangeY);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateSkillHandler;
