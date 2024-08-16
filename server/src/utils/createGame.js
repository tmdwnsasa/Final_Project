import { addGameSession } from '../sessions/game.session.js';
import { createUserInGame, deleteUserInLobby, getUserById } from '../sessions/user.session.js';
import { handlerError } from './error/errorHandler.js';
import CustomError from './error/customError.js';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from './error/errorCodes.js';
import { createMatchingCompleteNotification } from './notification/game.notification.js';
import { getLobbySession } from '../sessions/lobby.session.js';

const createGame = ({ redTeam, blueTeam }) => {
  try {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    //게임맵으로 이동후 해당 플레이어들 로비세션에서 삭제
    const lobbySession = getLobbySession();

    [...redTeam, ...blueTeam].forEach(({ id }) => {
      deleteUserInLobby(id);
    });

    [...redTeam, ...blueTeam].forEach(({ id }) => {
      lobbySession.removeUser(id);
    });

    //Red Team
    redTeam.forEach(({ id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다: ', id);
      }
      user.team = 'red';
      gameSession.addUser(user);
    });

    //Blue Team
    blueTeam.forEach(({ id }) => {
      const user = getUserById(id);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다: ', id);
      }
      user.team = 'blue';
      gameSession.addUser(user);
    });

    redTeam.forEach(({ id }) => {
      const user = getUserById(id);
      createUserInGame(user);
    });

    blueTeam.forEach(({ id }) => {
      const user = getUserById(id);
      createUserInGame(user);
    });

    //매치메이킹 완료 통지
    const message = '매칭 완료! 대결 시작!' ;
    const packet = createMatchingCompleteNotification(message);
    [...redTeam, ...blueTeam].forEach((player) => {
      if (player.socket) {
        player.socket.write(packet);
      }
    });

    gameSession.startGame();
  } catch (err) {
    [...redTeam, ...blueTeam].forEach(({ socket }) => {
      handlerError(socket, err);
    });
  }
};

export default createGame;
