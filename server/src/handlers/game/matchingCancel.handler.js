import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { removeUserFromQueue } from '../../sessions/matchQueue.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

const matchingCancel = ({ socket, userId, payload }) => {
  try {
    const { sessionID } = payload;

    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '로비 세션을 찾을 수 없습니다.');
    }

    const user = lobbySession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '로비 세션에서 유저를 찾을 수 없습니다.');
    }

    if (user.sessionId !== sessionID) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const response = createResponse(
      HANDLER_IDS.MATCHINGCANCEL,
      RESPONSE_SUCCESS_CODE,
      {
        message: `${user.name} 매칭을 취소했습니다.`,
      },
      user.playerId,
    );
    socket.write(response);

    const head = `<color=red>알림</color>`;
    const message = `<color=red>${user.name} 매칭 취소...</color>`;
    const type = '1';

    lobbySession.sendAllChatting(head, message, type);

    removeUserFromQueue(socket);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default matchingCancel;
