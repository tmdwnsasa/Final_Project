import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser, getUserById } from '../../sessions/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { findPossessionByPlayerID } from '../../db/game/game.db.js';
import CustomError from '../../utils/error/customError.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';

const loginHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, password } = payload;

    //있는 계정인지 확인
    let user = await findUserByPlayerId(playerId);
    let response = null;

    const loggedIn = getUserById(playerId);
    if (loggedIn) {
      throw new CustomError(ErrorCodes.LOGGED_IN_ALREADY, '이미 로그인 되어 있습니다');
    }

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    } else {
      await updateUserLogin(playerId);
    }
    if (!(await bcrypt.compare(password, user.pw))) {
      // 커스텀 에러 : 비밀번호 불일치
    }

    // 인게임인지 아닌지
    const gameSession = getGameSessionByPlayerId(playerId);

    const sessionId = uuidv4();
    //레디스로 sessionId를 넣는다.
    addUser(playerId, null, user.name, socket, sessionId);

    if (gameSession !== -1 && gameSession !== undefined) {
      // 게임 세션에 사람 추가 / 게임 입장 통지
      gameSession.addUser(user);
      // users = gameSession.getAllUsers;
      response = createResponse(HANDLER_IDS.JOIN_GAME, RESPONSE_SUCCESS_CODE, { sessionId: sessionId }, userId);
    } else {
      // 케릭터 선택
      const possessionDB = await findPossessionByPlayerID(playerId);
      const possession = possessionDB.map((data) => data.characterId);

      // 첫 로그인
      if (possession.length === 0) {
        response = createResponse(
          HANDLER_IDS.CHOICE_CHARACTER,
          RESPONSE_SUCCESS_CODE,
          { playerId: playerId, name: user.name, sessionId: sessionId },
          userId,
        );
      }
      // 이후 로그인
      else {
        response = createResponse(
          HANDLER_IDS.SELECT_CHARACTER,
          RESPONSE_SUCCESS_CODE,
          { playerId: playerId, name: user.name, sessionId: sessionId, possession: possession },
          userId,
        );
      }
    }

    // // 대기실 세션에 사람 추가 / 대기실 입장 통지
    // const lobbySession = getLobbySession();
    // lobbySession.addUser(user);
    // response = createResponse(HANDLER_IDS.JOIN_LOBBY, RESPONSE_SUCCESS_CODE, { sessionId: sessionId }, userId);

    // //클라이언트
    // response = createResponse(HANDLER_IDS.LOGIN, RESPONSE_SUCCESS_CODE, { sessionId: sessionId }, userId);

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default loginHandler;
