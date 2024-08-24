import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { removeUserFromQueue } from '../../sessions/matchQueue.session.js';
import { clearInLobby, deleteUserInLobby, getUserById } from '../../sessions/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const reselectCharacter = ({ socket, userId, payload }) => {
  try {
    deleteUserInLobby(userId);
    const lobbySession = getLobbySession();
    lobbySession.removeUser(userId);
    removeUserFromQueue(socket);
    clearInLobby(lobbySession, userId);

    const response = createResponse(
      HANDLER_IDS.RESELECTCHARACTER,
      RESPONSE_SUCCESS_CODE,
      {
        message: '캐릭터 재선택 조건 충족',
      },
      userId,
    );
    socket.write(response);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default reselectCharacter;
