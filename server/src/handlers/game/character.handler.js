import { findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createPossession } from '../../db/game/game.db.js';
import CustomError from '../../utils/error/customError.js';

const giveCharacterHandler = async ({ socket, userId, payload }) => {
  try {
    const { characterId } = payload;
    console.log(characterId);

    const user = findUserByPlayerId(userId);

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (characterId <= 0 && characterId >= 3) {
      //커스텀 에러 : 해당하는 ID의 케릭터가 없습니다.
    }

    createPossession(userId, characterId);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default giveCharacterHandler;
