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

    const userMoney = await userInventory.getPlayersMoney();
    console.log('User money:', userMoney);

    // const equippedItems = await userInventory.getEquippedItems();
    // const allItems = await userInventory.getAllItems();
    // const combinedStats = await userInventory.getCombinedStats();

    const inventoryData = {
      userMoney,
      // equippedItems,
      // allItems,
      // combinedStats
    };

    const response = createResponse(
      HANDLER_IDS.INVENTORY, 
      RESPONSE_SUCCESS_CODE, 
      {message: `${user.name}의 인벤토리 데이터 전송 완료 ${JSON.stringify(inventoryData)}`},
      user.playerId
    );
    console.log('Response created:', response);

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default inventoryHandler;
