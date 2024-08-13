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

    const idPasswordRegex = /^[a-zA-Z0-9]{4,10}$/;
    const nameRegex = /^[가-힣a-zA-Z0-9]{2,6}$/;

    let errorMessages = [];
    if (!idPasswordRegex.test(playerId)) {
      errorMessages.push('아이디가 조건을 만족하지 않습니다.');
    }

    if (!idPasswordRegex.test(password)) {
      errorMessages.push('비밀번호가 조건을 만족하지 않습니다.');
    }

    if (!nameRegex.test(name)) {
      errorMessages.push('이름이 조건을 만족하지 않습니다.');
    }

    if (errorMessages.length > 0) {
      throw new CustomError(ErrorCodes.VALIDATE_ERROR, errorMessages.join(' '));
    }

    const hashpassword = await bcrypt.hash(password, 10);

    let idCheck = await findUserByPlayerId(playerId);
    if (idCheck) {
      throw new CustomError(ErrorCodes.ALREADY_EXIST_ID, '이미 있는 아이디입니다.');
    }

    let nameCheck = await findUserByName(name);
    if (nameCheck) {
      throw new CustomError(ErrorCodes.ALREADY_EXIST_NAME, '이미 있는 이름입니다.');
    }

    createUser(playerId, hashpassword, name);

    const Response = createResponse(HANDLER_IDS.REGISTER, RESPONSE_SUCCESS_CODE, { message: '회원가입 완료' }, userId);
    socket.write(Response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default registerHandler;
