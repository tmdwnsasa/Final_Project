import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByName, findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';

const registerHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, password, name } = payload;

    let errorMessages = [];
    if (playerId.length <= 4) {
      errorMessages.push('아이디가 너무 짧습니다.');
    } else if (playerId.length >= 15) {
      errorMessages.push('아이디가 너무 깁니다.');
    }

    if (password.length <= 4) {
      errorMessages.push('패스워드가 너무 짧습니다.');
    } else if (password.length >= 15) {
      errorMessages.push('패스워드가 너무 깁니다.');
    }

    if (name.length > 5) {
      errorMessages.push('이름이 너무 깁니다.');
    }

    if (errorMessages.length > 0) {
      throw new CustomError(ErrorCodes.VALIDATE_ERROR, errorMessages.join(' '));
    }

    const hashpassword = await bcrypt.hash(password, 10);
    createUser(playerId, hashpassword, name);

    const Response = createResponse(HANDLER_IDS.REGISTER, RESPONSE_SUCCESS_CODE, { message: '회원가입 완료' }, userId);
    socket.write(Response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default registerHandler;
