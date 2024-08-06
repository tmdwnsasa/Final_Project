import { getAllGameSessions } from '../sessions/game.session.js';
import { getLobbySession } from '../sessions/lobby.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';
import { removeUserFromQueue } from '../sessions/matchQueue.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = getUserBySocket(socket);
  if (!user) {
    console.log('유저를 찾을 수 없습니다.');
    return;
  }
  removeUser(socket);
};
