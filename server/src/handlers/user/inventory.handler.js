import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const inventoryHandler = async ({socket, payload}) => {
  try {
    const { sessionId } = payload;
    console.log('Received payload:', payload);


    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (user.sessionId !== sessionId) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const userInventory = user.inventory;

    const userMoneyValue = await userInventory.getPlayersMoney();
    const userMoney = {money : userMoneyValue}

    const equippedItems = await userInventory.getEquippedItems();
    const allItems = await userInventory.getAllItems(); 
    const combinedStats = await userInventory.getCombinedStats();

    console.log('User combined stats:', combinedStats);

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
