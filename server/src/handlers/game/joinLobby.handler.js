import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinLobbyHandler = ({ socket, userId, payload }) => {
  try {
    const { characterId } = payload;
    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.LOBBY_NOT_FOUND, '로비를 찾을 수 없습니다');
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

    const joinLobbyResponse = createResponse(
      HANDLER_IDS.JOIN_LOBBY,
      RESPONSE_SUCCESS_CODE,
      { message: '대기실에 참가했습니다' },
      user.id,
    );

    socket.write(joinLobbyResponse);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default joinLobbyHandler;
