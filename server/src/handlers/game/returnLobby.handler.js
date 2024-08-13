import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSessionByPlayerId, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const returnLobbyHandler = ({ socket, userId, payload }) => {
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

  user.changeCharacter(user.characterId - 1);
  user.kill = 0;
  user.death = 0;
  user.damage = 0;

  lobbySession.addUser(user);
  user.updatePosition(0, 0);

  const response = createResponse(
    HANDLER_IDS.RETURN_LOBBY,
    RESPONSE_SUCCESS_CODE,
    {
      message: '로비 복귀 완료',
    },
    user.playerId,
  );
  socket.write(response);
};

export default returnLobbyHandler;
