import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

const updateChattingHandler = async ({ socket, userId, payload }) => {
  try {
    const { message, type, isLobby } = payload;
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

      lobbySession.sendAllChatting(user.name, message, type);
    } else {
      // 게임 세션
      const gameSession = getGameSessionByPlayerId(userId);
      if (!gameSession) {
        throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
      }

      gameSession.sendAllChatting(user.name, message, type);
    }
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateChattingHandler;
