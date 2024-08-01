import { addGameSession } from '../../sessions/game.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const createGameHandler = ({ redTeam, blueTeam, payload }) => {
  // console.log('User class in createGameHandler:', User); //디버깅용

  try {
    const { sessionId } = payload;

    if (user.sessionId !== sessionId) {
      throw new Error('세션ID 일치하지 않습니다');
    };

    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    //Red Team
    redTeam.forEach(({ socket, id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다: ',id );
      }
      gameSession.addUser(user);
    });

    //Blue Team
    blueTeam.forEach(({ socket, id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다: ',id );
      }
      gameSession.addUser(user);
    });

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다' },
      [...redTeam, ...blueTeam].map((player) => player.id),
    );

    [...redTeam, ...blueTeam].forEach(({ socket }) => {
        socket.write(createGameResponse);
    });
  } catch (err) {
    [...redTeam, ...blueTeam].forEach(({ socket }) => {
        handlerError(socket, err);
    });
  }
};

export default createGameHandler;

