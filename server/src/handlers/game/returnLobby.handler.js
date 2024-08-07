import { getGameSessionByPlayerId, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { getUserById } from '../../sessions/user.session.js';

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

  user.changeCharacter(user.characterId - 1);
  user.kill = 0;
  user.death = 0;
  user.damage = 0;

  lobbySession.addUser(user);
  user.updatePosition(0, 0);
};
