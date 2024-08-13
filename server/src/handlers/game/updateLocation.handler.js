import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y, isLobby } = payload;
    if (isLobby) {
      // 로비 세션
      const lobbySession = getLobbySession();
      if (!lobbySession) {
        throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '로비 세션을 찾을 수 없습니다.');
      }

      const user = lobbySession.getUser(userId);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '로비 세션에서 유저를 찾을 수 없습니다.');
      }

      user.updateDirection(x, y, lobbySession.getMaxLatency());
    } else {
      // 게임 세션
      const gameSession = getGameSessionByPlayerId(userId);
      if (!gameSession) {
        throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
      }
      const user = gameSession.getUser(userId);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '로비 세션에서 유저를 찾을 수 없습니다.');
      }

      user.updateDirection(x, y, gameSession.getMaxLatency());
    }
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateLocationHandler;
