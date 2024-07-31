import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
//여기 부터 시작
const joinLobbyHandler = ({ socket, userId, payload }) => {
  try {
    const { characterId } = payload;
    const lobbySession = getLobbySession(userId);
    if (!lobbySession) {
      // 커스텀 에러 로비를 찾을 수 없습니다.
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }
    user.characterId = characterId;

    const existUser = lobbySession.getUser(user.id);
    if (!existUser) {
      lobbySession.addUser(user);
    }

    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_LOBBY,
      RESPONSE_SUCCESS_CODE,
      { message: '대기실에 참가했습니다' },
      user.id,
    );

    socket.write(joinGameResponse);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default joinLobbyHandler;
