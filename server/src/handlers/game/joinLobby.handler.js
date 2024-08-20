import CharacterSkill from '../../classes/models/characterskill.class.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { createUserInLobby, getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinLobbyHandler = async ({ socket, userId, payload }) => {
  try {
    const { characterId } = payload;
    const lobbySession = getLobbySession();
    if (!lobbySession) {
      throw new CustomError(ErrorCodes.LOBBY_NOT_FOUND, '로비를 찾을 수 없습니다');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }
    const character = user.changeCharacter(characterId);
    const skill = user.changeCharacterSkill(characterId);

    const existUser = lobbySession.getUser(user.id);
    if (!existUser) {
      lobbySession.addUser(user);
      createUserInLobby(user);
    }

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

    const updatedStats = await user.getCombinedStats();

    const joinLobbyResponse = createResponse(
      HANDLER_IDS.JOIN_LOBBY,
      RESPONSE_SUCCESS_CODE,
      { ...character, userDatas, ...skill, updatedStats },
      user.id,
    );

    socket.write(joinLobbyResponse);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default joinLobbyHandler;
