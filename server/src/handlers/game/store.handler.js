import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const storeHandler = async ({ socket, userId, payload }) => {
  const { sessionId } = payload;
  const user = getUserById(userId);

  if (user.sessionId !== sessionId) {
    console.log('USER:',user.sessionId, sessionId);
    throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
  }
  
  let userMoney = await apiRequest(ENDPOINTS.user.findMoneyByPlayerId, { player_id: userId });
  const packet = createResponse(HANDLER_IDS.STORE, RESPONSE_SUCCESS_CODE, userMoney, user.playerId);
  socket.write(packet);
};
