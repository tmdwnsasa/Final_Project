import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { matchQueueSession } from '../../sessions/session.js';
import {
  addUserToQueue,
  removeUserFromQueue,
  getAllPlayersInQueue,
  getQueueLength,
} from '../../sessions/matchQueue.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createGame from '../../utils/createGame.js';
import { getUsersForGame } from '../../sessions/matchQueue.session.js';
import { lobbySession } from '../../sessions/session.js';

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
      console.log('이미 매칭큐에 있는 유저 입니다');
      console.log(getAllPlayersInQueue());
      return;
    }

    addUserToQueue(user);
    console.log(`${user.playerId} added to matching queue. Queue length: ${getQueueLength()}`);

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

      console.log(
        `팀 매칭 완료: Green Team - ${greenTeam.map((player) => player.playerId).join(', ')}, Blue Team - ${blueTeam.map((player) => player.playerId).join(', ')}`,
      );

      createGame({
        greenTeam: greenTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        blueTeam: blueTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        payload: { sessionID },
      });

      greenTeam.forEach((player) => removeUserFromQueue(player.socket));
      blueTeam.forEach((player) => removeUserFromQueue(player.socket));

      console.log('현재 매칭큐에 있는 유저들: ', getAllPlayersInQueue());
    }
  } catch (err) {
    handlerError(socket, err);
  }
};

export default matchMakingHandler;
