import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { matchQueueSession } from '../../sessions/session.js';
import { addUserToQueue, removeUserFromQueue } from '../../sessions/matchQueue.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createGame from '../../utils/createGame.js';
import { getUsersForGame } from '../../sessions/matchQueue.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';

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

    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '로비 세션을 찾을 수 없습니다.');
    }

    const response = createResponse(
      HANDLER_IDS.MATCHMAKING,
      RESPONSE_SUCCESS_CODE,
      {
        message: `${user.name} 매칭 중입니다,`,
      },
      user.playerId,
    );
    socket.write(response);

    const userId = `<color=red>알림</color>`;
    const message = `<color=red>${user.name} 매칭 중...</color>`;
    const type = '1';

    lobbySession.sendAllChatting(userId, message, type);

    const existingUserInQueue = matchQueueSession.some((userInQueue) => userInQueue.playerId === user.playerId);

    if (existingUserInQueue) {
      return;
    }

    addUserToQueue(user);

    let greenIndex = [];
    let blueIndex = [];
    matchQueueSession.forEach((user, index) => {
      if (user.guild === 1 && blueIndex.length < 2) {
        blueIndex.push(index);
      } else if (user.guild === 2 && greenIndex.length < 2) {
        greenIndex.push(index);
      }
    });

    if (blueIndex.length === 2 && greenIndex.length === 2) {
      const players = getUsersForGame();

      let greenTeam = [];
      let blueTeam = [];

      blueIndex.forEach((index) => {
        blueTeam = blueTeam.concat(players.slice(index, index + 1));
      });
      greenIndex.forEach((index) => {
        greenTeam = greenTeam.concat(players.slice(index, index + 1));
      });

      createGame({
        greenTeam: greenTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        blueTeam: blueTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        payload: { sessionID },
      });

      greenTeam.forEach((player) => removeUserFromQueue(player.socket));
      blueTeam.forEach((player) => removeUserFromQueue(player.socket));
    }
  } catch (err) {
    handlerError(socket, err);
  }
};

export default matchMakingHandler;
