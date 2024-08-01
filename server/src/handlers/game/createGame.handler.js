import { addGameSession } from '../../sessions/game.session.js';
import { getUserById } from '../../sessions/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const createGameHandler = ({ redTeam, blueTeam, payload }) => {
  try {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    redTeam.forEach(({ socket, id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
      }
      user.team = 'red';
      gameSession.addUser(user);
    });

    blueTeam.forEach(({ socket, id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
      }
      user.team = 'blue';
      gameSession.addUser(user);
    });

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다' },
      [...redTeam, ...blueTeam].map((player) => player.id)
    );

    [...redTeam, ...blueTeam].forEach(({socket}) => {
      socket.write(createGameResponse);
    });

    gameSession.startGame();
  } catch (err) {
    [...redTeam, ...blueTeam].forEach(({socket}) => {
      handlerError(socket, err);
    });
  }
};

export default createGameHandler;
