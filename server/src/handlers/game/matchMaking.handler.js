import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { matchQueueSession } from '../../sessions/session.js';
import { addUserToQueue } from '../../sessions/matchQueue.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createGameHandler from '../game/createGame.handler.js';

const matchMakingHandler = ({ socket, payload }) => {
  try {
    const { sessionID } = payload;

    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }
    console.log('this is payload',payload)

    //세션ID 확인 
    if (user.sessionId !== sessionID) {
      throw new Error('세션ID 일치하지 않습니다');
    }


    addUserToQueue(user);
    console.log(`${user.playerId} added to matching queue. Queue length: ${matchQueueSession.length}`);

    if (matchQueueSession.length >= 4) {
      const players = matchQueueSession.getUsersForGame();

      const redTeam = players.slice(0, 2);
      const blueTeam = players.slice(2, 4);

      console.log(
        `Teams formed: Red Team - ${redTeam.map((player) => player.playerId).join(', ')}, Blue Team - ${blueTeam.map((player) => player.playerId).join(', ')}`,
      );

      createGameHandler({
        redTeam: redTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        blueTeam: blueTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        payload: { sessionID },
      });

      // 매칭이 완료 시 성공 메시지
      const matchFound = createResponse(
        HANDLER_IDS.MATCHMAKING,
        RESPONSE_SUCCESS_CODE,
        { message: '매칭 완료' }, 
        user.playerId 
      );
      socket.write(matchFound);

    } 
  } catch (err) {
    handlerError(socket, err);
  }
};

export default matchMakingHandler;
