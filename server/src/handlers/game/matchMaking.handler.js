import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { matchQueueSession } from '../../sessions/session.js';
import { addUserToQueue, removeUserFromQueue,getAllPlayersInQueue } from '../../sessions/matchQueue.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createGameHandler from '../game/createGame.handler.js';
import { getUsersForGame } from '../../sessions/matchQueue.session.js';

const matchMakingHandler = ({ socket, payload }) => {
  try {
    const { sessionID } = payload;

    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (user.sessionId !== sessionID) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const existingUserInQueue = matchQueueSession.some(userInQueue => userInQueue.playerId === user.playerId);

    if (existingUserInQueue) {
    //   const alreadyInQueueResponse = createResponse(
    //     HANDLER_IDS.MATCHMAKING,
    //     RESPONSE_SUCCESS_CODE,  
    //     { message: '유저가 이미 매칭큐에 있습니다' },
    //     user.playerId,
    //   );
    //   socket.write(alreadyInQueueResponse);
      
      console.log("이미 매칭큐에 있는 유저 입니다");
      console.log(getAllPlayersInQueue());
      return;
    }

    addUserToQueue(user);
    console.log(`${user.playerId} added to matching queue. Queue length: ${matchQueueSession.length}`);

    if (matchQueueSession.length >= 4) {
      const players = getUsersForGame();

      const redTeam = players.slice(0, 2);
      const blueTeam = players.slice(2, 4);

      console.log(
        `팀 매칭 완료: Red Team - ${redTeam.map(player => player.playerId).join(', ')}, Blue Team - ${blueTeam.map(player => player.playerId).join(', ')}`
      );

      createGameHandler({
        redTeam: redTeam.map(player => ({ socket: player.socket, id: player.playerId })),
        blueTeam: blueTeam.map(player => ({ socket: player.socket, id: player.playerId })),
        payload: { sessionID }
      });

      redTeam.forEach(player => removeUserFromQueue(player.socket));
      blueTeam.forEach(player => removeUserFromQueue(player.socket));

      console.log('현재 매칭큐에 있는 유저들: ', getAllPlayersInQueue());

      const matchFoundResponse = createResponse(
        HANDLER_IDS.MATCHMAKING,
        RESPONSE_SUCCESS_CODE,  
        { message: '매칭 완료!' },
        user.playerId,
      );
      socket.write(matchFoundResponse);
    }
  } catch (err) {
    handlerError(socket, err);
  }
};

export default matchMakingHandler;
