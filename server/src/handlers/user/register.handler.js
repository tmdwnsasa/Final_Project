import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByName, findUserByPlayerId, updateUserLogin } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';

const registerHandler = async ({ socket, userId, payload }) => {
  try {
    const { playerId, password, name } = payload;
    console.log(playerId, password, name);
    if (playerId.length <= 4 && pw.length <= 4 && playerId.length <= 15 && pw.length <= 15) {
      // 커스텀 에러 : 입력 필드가 잘못됬다.
    }

    let idCheck = await findUserByPlayerId(playerId);
    if (idCheck) {
      // 커스텀 에러 : id가 이미 있다.
    }

    let nameCheck = await findUserByName(name);
    if (nameCheck) {
      // 커스텀 에러 : name이 이미 있다.
    }

    const hashpassword = await bcrypt.hash(password, 10);
    createUser(playerId, password, name);

    const Response = createResponse(HANDLER_IDS.REGISTER, RESPONSE_SUCCESS_CODE, { message: '회원가입 완료' }, userId);
    socket.write(Response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default registerHandler;
