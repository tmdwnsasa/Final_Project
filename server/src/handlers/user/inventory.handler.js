import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const inventoryHandler = async ({ socket, userId, payload }) => {
  try {
    const { message } = payload;
    console.log('Received payload:', payload);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    const updatedStats = await user.getCombinedStats();
    const allInventoryItems = await apiRequest(ENDPOINTS.user.findUserInventory, { player_id: user.playerId });
    const allEquippedItems = allInventoryItems.filter((inventoryItem) => inventoryItem.equippedItems === 1);
    const userMoney = await apiRequest(ENDPOINTS.user.findMoneyByPlayerId, { player_id: userId });
    const money = userMoney.money;

    const updatedInventoryData = {
      updatedStats,
      allInventoryItems,
      allEquippedItems,
      money
    };

    const response = createResponse(
      HANDLER_IDS.EQUIP_ITEM,
      RESPONSE_SUCCESS_CODE,
      { ...updatedInventoryData, message: '인벤토리 정보 불러오기 완료' },
      user.playerId,
    );

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default inventoryHandler;
