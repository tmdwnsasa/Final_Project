import { addGameSession } from '../../sessions/game.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const createGameHandler = ({ sockets, userIds, payload }) => {
  try {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    //유저ID 목록으로 사용자 정보를 가져옴
    const users = userIds.map((userId) => getUserById(userId)); 
    // 각 유저 정보를 게임 세션에 추가
    users.forEach((user) => {
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
      }
      gameSession.addUser(user); // Add each user to the game session
    });

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다' },
      userIds,
    );

    sockets.forEach((socket) => {
      socket.write(createGameResponse);
    });
  } catch (err) {
    sockets.forEach((socket) => {
      handlerError(sockets, err);
    });
  }
};

export default createGameHandler;
