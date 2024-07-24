import { getAllGameSessions } from '../../sessions/game.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const updateLocationHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameSession = getAllGameSessions()[0];

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다.');
    }
    user.updateDirection(x, y);
    const packet = gameSession.getAllLocation();

    socket.write(packet);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateLocationHandler;
