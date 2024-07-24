import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser } from '../../sessions/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const registerHandler = async ({ socket, userId, payload }) => {
  try {
    const { id, password, name } = payload;

    let user = await findUserByDeviceId(id);
    if (user) {
      // id가  이미 있다.
      // throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    } else {
      await updateUserLogin(user.id);
    }

    addUser(socket, user.id);

    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId,
    );

    socket.write(initialResponse);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default registerHandler;
