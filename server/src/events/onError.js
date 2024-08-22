import { getLobbySession } from '../sessions/lobby.session.js';
import { deleteUserInLobby, getUserBySocket, removeUser } from '../sessions/user.session.js';
import { removeUserFromQueue } from '../sessions/matchQueue.session.js';
import CustomError from '../utils/error/customError.js';
import { handlerError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  console.log('소켓 오류: ', err);

  if (err.code === 'ECONNRESET') {
    console.error('클라이언트가 연결을 비정상적으로 종료했습니다.');
  } else {
    handlerError(socket, new CustomError(500, `소켓 오류: ${err.message}`));
  }

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
};
