import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

const updateChattingHandler = async ({ socket, userId, payload }) => {
  try {
    const { message, type } = payload;

    // 로비 세션
    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '로비 세션을 찾을 수 없습니다.');
    }

    lobbySession.sendChattingAll(userId, message, type);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateChattingHandler;
