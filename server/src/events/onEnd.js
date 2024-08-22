import { removeUserFromQueue } from '../sessions/matchQueue.session.js';
import { lobbySession } from '../sessions/session.js';
import { deleteUserInLobby, getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = getUserBySocket(socket);
  if (!user) {
    console.log('유저를 찾을 수 없습니다.');
    return;
  }
  deleteUserInLobby(user.playerId);
  lobbySession.removeUser(user.playerId);
  removeUserFromQueue(socket);
  removeUser(socket);
};
