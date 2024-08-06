import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession, getGameSessionByPlayerId, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const returnLobbyHandler = ({ socket, userId, payload }) => {
  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
  }

  const gameSession = getGameSessionByPlayerId(userId);
  const lobbySession = getLobbySession();
  gameSession.removeUser(userId);
  if (!gameSession.getAllUsers().length) {
    removeGameSession(gameSession.id);
  }

  lobbySession.addUser(user);
  user.updatePosition(0, 0);
};
