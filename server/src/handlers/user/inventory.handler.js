import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const inventoryHandler = async (playerId, socket, payload) => {
  try {
    const { sessionID } = payload;

    const user = getUserById(playerId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (user.sessionId !== sessionID) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const userInventory = user.inventory;

    const userMoney = await userInventory.getPlayersMoney();
    const equippedItems = await userInventory.loadEquippedItems();
    const allItems = await userInventory.getAllItems();
    const combinedStats = await userInventory.getCombinedStats();

    const inventoryData = {
      userMoney,
      equippedItems,
      allItems,
      combinedStats
    };

    const response = createResponse(
      HANDLER_IDS.INVENTORY, 
      RESPONSE_SUCCESS_CODE, 
      inventoryData, 
      user.playerId
    );
    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default inventoryHandler;
