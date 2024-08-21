import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUserMoney, findUserByName, findUserByPlayerId } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';

const registerHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, password, name, guild } = payload;

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

    if (guild === 0 || guild > 2) {
      errorMessages.push('진영이 잘못 선택되었습니다.');
    }

    if (errorMessages.length > 0) {
      throw new CustomError(ErrorCodes.VALIDATE_ERROR, errorMessages.join(' '));
    }

    const hash_password = await bcrypt.hash(password, 10);

    await apiRequest(ENDPOINTS.user.createUser, {
      player_id: playerId,
      name,
      pw: hash_password,
      guild,
      money: 5000,
      character_id: 0x000,
    });
    //DB 서버에서 생성중 일부만 성공해도 그냥 넘어가는중 DB 서버에서 트랜잭션으로 처리해도 될까용?

    const Response = createResponse(HANDLER_IDS.REGISTER, RESPONSE_SUCCESS_CODE, { message: '회원가입 완료' }, userId);
    socket.write(Response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default registerHandler;
