import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserInventoryItemsByPlayerId } from '../../db/user/user.db.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const unequipHandler = async ({ socket, userId, payload }) => {
  try {
    const { itemId } = payload;

    const itemIdInt = parseInt(itemId, 10); 

    // Check if conversion was successful
    if (isNaN(itemIdInt)) {
      throw new CustomError(ErrorCodes.INVALID_ITEM_ID, 'Invalid item ID received.');
    }
    console.log('Unequip Request - Received payload:', payload);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }
    const userInventory = await findUserInventoryItemsByPlayerId(user.playerId);

    const item = userInventory.items.find((item) => item.itemId === itemId);
    if (!item) {
      throw new CustomError(ErrorCodes.ITEM_NOT_FOUND, 'Item not found in inventory.');
    }

    const equippedItems = await userInventory.getAllEquippedItems();
    const isEquipped = equippedItems.some((equippedItem) => equippedItem.itemId === itemId);

    if (!isEquipped) {
      const response = createResponse(
        HANDLER_IDS.UNEQUIP_ITEM,
        RESPONSE_SUCCESS_CODE,
        { responseMessage: 'Item is not equipped.' }, //장착되지 않았을 경우
        user.playerId
      );
      socket.write(response);
      return;
    }

    await userInventory.unequipItem(itemId);
    const updatedStats = await userInventory.getCombinedStats();
    const allInventoryItems = await findUserInventoryItemsByPlayerId(playerId);
    
    updatedInventoryData ={
        updatedStats,
        allInventoryItems,
        equippedItems
      }
    
    const response = createResponse(
      HANDLER_IDS.UNEQUIP_ITEM,
      RESPONSE_SUCCESS_CODE,
      { updatedInventoryData, responseMessage: 'Item unequipped successfully.' },
      user.playerId
    );

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default unequipHandler;
