import { getGameSessionByPlayerId, removeGameSession } from '../sessions/game.session.js';
import { getLobbySession } from '../sessions/lobby.session.js';
import { removeUserFromQueue } from '../sessions/matchQueue.session.js';
import { deleteUserInLobby, getUserById, getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = getUserBySocket(socket);
  if (!user) {
    console.log('유저를 찾을 수 없습니다.');
    return;
  }
  deleteUserInLobby(user.playerId);
  const lobbySession = getLobbySession();
  lobbySession.removeUser(user.playerId);
  removeUserFromQueue(socket);

  removeUser(socket);

  const gameSession = getGameSessionByPlayerId(user.playerId);
  if (gameSession) {
    let exitUser = 0;
    const remainingUsers = gameSession.getAllUsers();
    remainingUsers.forEach((user) => {
      const inUserSession = getUserById(user.playerId);
      if (!inUserSession) {
        exitUser++;
      }
    });

    if (exitUser === gameSession.getAllUsers().length) {
      removeGameSession(gameSession.id);
    }
  }
};
