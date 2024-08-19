import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
import { getUserById } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const storeHandler = async ({ socket, userId, payload }) => {
  console.log(userId);
  const { message } = payload;
  console.log(message);
  const user = getUserById(userId);
  let userMoney = await apiRequest(ENDPOINTS.user.findMoneyByPlayerId, { player_id: userId });
  const packet = createResponse(HANDLER_IDS.STORE, RESPONSE_SUCCESS_CODE, userMoney, user.playerId);
  socket.write(packet);
};
