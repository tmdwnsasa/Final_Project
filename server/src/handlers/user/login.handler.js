import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser, getUserById } from '../../sessions/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { findPossessionByPlayerID } from '../../db/game/game.db.js';
import CustomError from '../../utils/error/customError.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';

const loginHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, password } = payload;

    //있는 계정인지 확인
    let [user] = await apiRequest(ENDPOINTS.user.findUserByPlayerId, { player_id: playerId });
    let response = null;
    //재로그인 방지
    const loggedIn = getUserById(playerId);
    if (loggedIn) {
      throw new CustomError(ErrorCodes.LOGGED_IN_ALREADY, '이미 로그인 되어 있습니다');
    }

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    } else {
      await apiRequest(ENDPOINTS.user.updateUserLogin, { player_id: playerId });
    }

    if (!(await bcrypt.compare(password, user.pw))) {
      throw new CustomError(ErrorCodes.MISMATCH_PASSWORD, '비밀번호가 틀렸습니다.');
    }

    // 인게임인지 아닌지
    const gameSession = getGameSessionByPlayerId(playerId);

    const sessionId = uuidv4();
    addUser(playerId, user.name, user.guild, socket, sessionId);

    if (gameSession !== -1 && gameSession !== undefined) {
      // 게임 세션에 사람 추가 / 게임 입장 통지
      gameSession.addUser(user);
      // users = gameSession.getAllUsers;
      response = createResponse(HANDLER_IDS.JOIN_GAME, RESPONSE_SUCCESS_CODE, { sessionId: sessionId }, userId);
    } else {
      // 케릭터 선택
      const [possessionDB] = await apiRequest(ENDPOINTS.game.findPossessionByPlayerID, { player_id: playerId });
      if (possessionDB.characterId == 0) {
        response = createResponse(
          HANDLER_IDS.CHOICE_CHARACTER,
          RESPONSE_SUCCESS_CODE,
          { playerId: playerId, name: user.name, guild: user.guild, sessionId: sessionId },
          userId,
        );
      }

      // 이후 로그인
      else {
        response = createResponse(
          HANDLER_IDS.SELECT_CHARACTER,
          RESPONSE_SUCCESS_CODE,
          { playerId: playerId, name: user.name, guild: user.guild, sessionId: sessionId, possession: possession },
          userId,
        );
      }
    }

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default loginHandler;
