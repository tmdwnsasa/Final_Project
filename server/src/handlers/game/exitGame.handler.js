import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { removeUserFromQueue } from '../../sessions/matchQueue.session.js';
import { lobbySession } from '../../sessions/session.js';
import { deleteUserInLobby } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const exitGameHandler = ({ socket, userId, data }) => {
  deleteUserInLobby(userId);
  lobbySession.removeUser(userId);
  removeUserFromQueue(socket);

  const exitResponse = createResponse(
    HANDLER_IDS.EXIT,
    RESPONSE_SUCCESS_CODE,
    { message: '연결을 해제합니다.' },
    userId,
  );

  setTimeout(() => socket.write(exitResponse), 500);
};

export default exitGameHandler;
