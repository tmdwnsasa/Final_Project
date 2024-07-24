import { addUser, getUserById } from '../../sessions/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, characterId, latency, frame } = payload;
    let user = await findUserByDeviceID(playerId);

    if (!user) {
      user = await createUser(playerId);
    } else {
      await updateUserLogin(user.playerId);
    }

    const { x, y } = user;
    addUser(playerId, characterId, latency, frame, socket);

    user = getUserById(playerId);
    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '로비 세션을 찾을 수 없습니다.');
    }

    const existUser = lobbySession.getUser(user.playerId);
    if (!existUser) {
      lobbySession.addUser(user);
    }

    const newX = x ? x : 0;
    const newY = y ? y : 0;

    user.updatePosition(newX, newY);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.playerId, x: newX, y: newY },
      playerId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default initialHandler;
