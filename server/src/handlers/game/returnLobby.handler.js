import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSessionByPlayerId, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import {
  createUserInLobby,
  deleteOtherUserInGame,
  deleteUserInGame,
  getUserById,
} from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const returnLobbyHandler = ({ socket, userId, payload }) => {
  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
  }

  const gameSession = getGameSessionByPlayerId(userId);
  const lobbySession = getLobbySession();
  deleteUserInGame(userId);
  gameSession.removeUser(userId);

  let exitUser = 0;
  const remainingUsers = gameSession.getAllUsers();
  remainingUsers.forEach((user) => {
    const inUserSession = getUserById(user.playerId);
    if (!inUserSession) {
      exitUser++;
    }
  });

  if (!gameSession.getAllUsers().length || exitUser === gameSession.getAllUsers().length) {
    removeGameSession(gameSession.id);
  }
  deleteOtherUserInGame(user.playerId, gameSession);

  user.changeCharacter(user.characterId - 1);
  user.kill = 0;
  user.death = 0;
  user.damage = 0;

  lobbySession.addUser(user);
  createUserInLobby(user);
  user.updatePosition(0, 0);

  const userDatas = lobbySession
    .getAllUsers()
    .filter((user) => {
      if (user.playerId !== userId) return true;
    })
    .map((user) => {
      const data = {
        playerId: user.name,
        characterId: user.characterId - 1,
        guild: user.guild,
      };
      if (data.playerId !== userId) return data;
    });

  const response = createResponse(
    HANDLER_IDS.RETURN_LOBBY,
    RESPONSE_SUCCESS_CODE,
    {
      userDatas,
    },
    user.playerId,
  );
  socket.write(response);
};

export default returnLobbyHandler;
