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

    if (
      playerId.length <= 4 &&
      password.length <= 4 &&
      playerId.length >= 15 &&
      password.length >= 15 &&
      name.length < 5
    ) {
      throw new CustomError(ErrorCodes.VALIDATE_ERROR, '아이디, 패스워드, 이름이 너무 짧거나 깁니다.');
    }

    let idCheck = await findUserByPlayerId(playerId);
    if (idCheck) {
      throw new CustomError(ErrorCodes.ALREADY_EXIST_ID, '이미 있는 아이디입니다.');
    }

    let nameCheck = await findUserByName(name);
    if (nameCheck) {
      throw new CustomError(ErrorCodes.ALREADY_EXIST_NAME, '이미 있는 이름입니다.');
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
