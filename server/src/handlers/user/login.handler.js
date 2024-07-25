import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser } from '../../sessions/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getLobbySession } from '../../sessions/lobby.session.js';

const loginHandler = async ({ socket, userId, payload }) => {
  try {
    const { id, password } = payload;

    let user = await findUserByPlayerId(id);

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    } else {
      await updateUserLogin(user.id);
    }
    if (!(await bcrypt.compare(password, user.pw))) {
      // 커스텀 에러 : 비밀번호 불일치
    }

    // 유저 추가
    //addUser();
    // 인게임인지 아닌지
    const gameSession = getGameSessionByPlayerId(id);
    const lobbySession = getLobbySession();

    if (gameSession !== -1) {
      // 게임 세션에 사람 추가 / 게임 입장 통지
      gameSession.addUser(user);
    } else {
      // 대기실 세션에 사람 추가 / 대기실 입장 통지
      lobbySession.addUser(user);
    }

    const sessionId = uuidv4();
    //레디스로 sessionId를 넣는다.

    //클라이언트
    const initialResponse = createResponse(HANDLER_IDS.LOGIN, RESPONSE_SUCCESS_CODE, { sessionId: sessionId }, userId);

    socket.write(initialResponse);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default loginHandler;
