import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findMoneyByPlayerId } from '../../db/user/user.db.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const storeHandler = async ({ socket, userId, payload }) => {
  const { sessionId } = payload;
  const user = getUserById(userId);
  let userMoney = await findMoneyByPlayerId(user.playerId);

  console.log(userMoney);
  if (user.sessionId !== sessionId) {
    throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
  }

  if (!userMoney) {
    userMoney = { money: 0 };
  }
  const packet = createResponse(HANDLER_IDS.STORE, RESPONSE_SUCCESS_CODE, userMoney, user.playerId);
  socket.write(packet);
};
