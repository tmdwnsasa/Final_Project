import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
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

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    //해당 유저의 인벤토리에 해제하려는 장비가 있는지 확인
    const userInventory = await apiRequest(ENDPOINTS.user.findUserInventory, { player_id: user.playerId });
    const item = userInventory.find((item) => item.itemId === itemIdInt);

    if (!item) {
      throw new CustomError(ErrorCodes.ITEM_NOT_FOUND, 'Item not found in inventory.');
    }

    //장착되지 않았을 경우
    const groupedItemIdsInInventory = await apiRequest(ENDPOINTS.user.findItemIdInInventory, {
      player_id: user.playerId,
      item_id: itemIdInt,
    });
    const equippedItems = groupedItemIdsInInventory.filter((inventoryItem) => {
      if (inventoryItem.equippedItems === 1) return inventoryItem;
    });
    const isEquipped = equippedItems.some((inventoryItem) => inventoryItem.itemId === item.itemId);

    if (!isEquipped) {
      const response = createResponse(
        HANDLER_IDS.UNEQUIP_ITEM,
        RESPONSE_SUCCESS_CODE,
        { responseMessage: 'Item is not equipped.' },
        user.playerId,
      );
      socket.write(response);
      return;
    }

    await apiRequest(ENDPOINTS.user.unequipItem, { player_id: user.playerId, item_id: itemIdInt });
    const updatedStats = await user.getCombinedStats();
    const allInventoryItems = await apiRequest(ENDPOINTS.user.findUserInventory, { player_id: user.playerId });
    const allEquippedItems = allInventoryItems.filter((inventoryItem) => inventoryItem.equippedItems === 1);

    const updatedInventoryData = {
      updatedStats,
      allInventoryItems,
      allEquippedItems,
    };

    const response = createResponse(
      HANDLER_IDS.UNEQUIP_ITEM,
      RESPONSE_SUCCESS_CODE,
      { ...updatedInventoryData, message: 'Item unequipped successfully.' },
      user.playerId,
    );

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default unequipHandler;
