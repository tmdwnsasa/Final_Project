import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const returnLobbyHandler = ({ socket, userId, data }) => {
  // const gameSession = getGameSession();
  // const lobbySession = getLobbySession();
  // const user = gameSession.getUser(userId);
  // gameSession.removeUser(userId);
  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
  }
  // lobbySession.addUser(user);
  // removeGameSession();
  const payload = { message: '대기실에 참가했습니다' };
  const packet = createResponse(HANDLER_IDS.JOIN_LOBBY, RESPONSE_SUCCESS_CODE, payload, user.Id);
  socket.write(packet);
};
