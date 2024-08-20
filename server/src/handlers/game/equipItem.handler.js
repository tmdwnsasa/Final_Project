import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserInventoryItemsByPlayerId} from '../../db/user/user.db.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { itemStats } from '../../assets/itemStat.asset.js';

const equipItemHandler = async ({ socket, userId, payload }) => {
  try {
    const { itemId} = payload;

    const itemIdInt = parseInt(itemId, 10); 


    if (isNaN(itemIdInt)) {
      throw new CustomError(ErrorCodes.INVALID_ITEM_ID, 'Invalid item ID received.');
    }
    console.log('Equip Request - Received payload:', payload);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    //아이템ID와 일치하는지 확인
    const itemInfo = itemStats.find((item) => item.itemId === itemIdInt);
    if (!itemInfo) {
      throw new CustomError(ErrorCodes.ITEM_NOT_FOUND, 'Item does not exist.');
    }

    //이미 장착되어있는지 확인
    // const userInventory = user.inventory;
    const getAllInventoryItems = await user.getAllInventoryItems(userId);
    const isEquipped = equippedItems.some((equippedItem) => equippedItem.itemId === itemIdInt);

    if (isEquipped) {
      const response = createResponse(
        HANDLER_IDS.EQUIP_ITEM,
        RESPONSE_SUCCESS_CODE,
        { responseMessage: 'Item is already equipped.' },
        user.playerId
      );
      socket.write(response);
      return;
    }

    await equipItem(itemIdInt);
    const updatedStats = await getCombinedStats();
    const allInventoryItems = await findUserInventoryItemsByPlayerId(userId);

    updatedInventoryData ={
      updatedStats,
      allInventoryItems,
      equippedItems
    }

    const response = createResponse(
      HANDLER_IDS.EQUIP_ITEM,
      RESPONSE_SUCCESS_CODE,
      { updatedInventoryData, responseMessage: 'Item equipped successfully.' },
      user.playerId
    );

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default equipItemHandler;
