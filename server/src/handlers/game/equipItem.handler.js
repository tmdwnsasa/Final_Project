import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { equipItemPlayerId, findUserInventoryItemsByPlayerId } from '../../db/user/user.db.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { itemStats } from '../../assets/itemStat.asset.js';
import { findItemStats } from '../../db/game/game.db.js';

const equipItemHandler = async ({ socket, userId, payload }) => {
  try {
    const { itemId } = payload;

    const itemIdInt = parseInt(itemId, 10);

    if (isNaN(itemIdInt)) {
      throw new CustomError(ErrorCodes.INVALID_ITEM_ID, 'Invalid item ID received.');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    //아이템ID와 일치하는지 확인
    const item = await findItemStats(itemId);
    if (!item) {
      throw new CustomError(ErrorCodes.ITEM_NOT_FOUND, 'Item does not exist.');
    }

    //이미 장착되어있는지 확인
    const inventoryItems = await user.getAllInventoryItems();
    const equippedItems = inventoryItems.filter((inventoryItem) => {
      if (inventoryItem.equippedItems === 1) return inventoryItem;
    });

    const isEquipped = equippedItems.some((inventoryItem) => inventoryItem.equipSlot === item.itemEquipSlot);

    if (isEquipped) {
      const response = createResponse(
        HANDLER_IDS.EQUIP_ITEM,
        RESPONSE_SUCCESS_CODE,
        { responseMessage: 'Item is already equipped.' },
        user.playerId,
      );
      socket.write(response);
      return;
    }

    await equipItemPlayerId(userId, itemId);
    const updatedStats = await user.getCombinedStats();
    const allInventoryItems = await findUserInventoryItemsByPlayerId(userId);
    const allEquippedItems = allInventoryItems.filter((inventoryItem) => inventoryItem.equippedItems === 1);

    console.log('invenitems : ', allInventoryItems);
    console.log('Equippeditems : ', allEquippedItems);
    const updatedInventoryData = {
      updatedStats,
      allInventoryItems,
      allEquippedItems,
    };

    const response = createResponse(
      HANDLER_IDS.EQUIP_ITEM,
      RESPONSE_SUCCESS_CODE,
      { ...updatedInventoryData, message: 'Item equipped successfully.' },
      user.playerId,
    );

    socket.write(response);
  } catch (err) {
    handlerError(socket, err);
  }
};

export default equipItemHandler;
