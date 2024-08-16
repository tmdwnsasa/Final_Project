import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const equipItemHandler = async ({ socket, payload }) => {
  try {
    const { itemId} = payload;
    console.log('Equip Request - Received payload:', payload);

    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, 'User not found.');
    }

    if (user.sessionId !== sessionId) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, 'Session ID does not match.');
    }

    const userInventory = user.inventory;
    await userInventory.getAllItems();

    const item = userInventory.items.find((item) => item.itemId === itemId);
    if (!item) {
      throw new CustomError(ErrorCodes.ITEM_NOT_FOUND, 'Item not found in inventory.');
    }

    const equippedItems = await userInventory.getEquippedItems();
    const isEquipped = equippedItems.some((equippedItem) => equippedItem.itemId === itemId);

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

    await userInventory.equipItem(itemId);
    const updatedStats = await userInventory.getCombinedStats();
    const allItems = await userInventory.getAllItems();

    updatedInventoryData ={
      updatedStats,
      allItems,
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
