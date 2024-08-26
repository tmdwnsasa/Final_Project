import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';

const removeSkillHandler = ({ socket, userId, payload }) => {
  try {
    const { prefabNum, skillType } = payload;
    const gameSession = getGameSessionByPlayerId(userId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }
    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다');
    }
    switch (skillType) {
      case 2:
        gameSession.intervalManager.removeInterval(prefabNum, 'bullet');
        break;

      default:
        break;
    }
    // const response = createResponse(
    //   HANDLER_IDS.SKILLREMOVE,
    //   RESPONSE_SUCCESS_CODE,
    //   {
    //     message: '스킬 프리팹 삭제 완료',
    //   },
    //   user.playerId,
    // );
    // socket.write(response);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default removeSkillHandler;
