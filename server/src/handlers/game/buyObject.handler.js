import { characterAssets } from '../../assets/character.asset.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findPossessionByPlayerID, purchaseCharacterTransaction } from '../../db/game/game.db.js';
import { findMoneyByPlayerId, updateUserMoney } from '../../db/user/user.db.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const purchaseCharacter = async ({ socket, userId, payload }) => {
  try {
    const { name, price } = payload;

    const intPrice = parseInt(price);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    const userMoney = await findMoneyByPlayerId(userId);
    const money = userMoney.money;

    //characterId와 일치하는 해당 캐릭터를 db에서 가져옴
    const characterInfo = characterAssets.find((character) => character.characterName === name);
    if (!characterInfo) {
      throw new CustomError(ErrorCodes.CHARACTERID_NOT_FOUND, '해당 캐릭터 정보를 찾을 수 없어요!');
    }

    //유저의 possession에 이미 보유한 캐릭터일 경우 (상점에는 4캐릭터 전부 띄워놓을 예정)
    const userPossession = await findPossessionByPlayerID(userId);
    const possession = userPossession.find((possession) => possession.characterId === characterInfo.characterId - 1);
    if (possession) {
      const message = `이미 보유중`;
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }

    if (money < intPrice) {
      const message = '잔액이 부족합니다';
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }
    //가격 차감
    const newUserMoney = money - intPrice;

    // db저장
    await purchaseCharacterTransaction(userId, newUserMoney, characterInfo.characterId - 1);
    const message = `${name}가 정상적으로 구매 되었다!`;
    console.log(message);

    const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  } catch (err) {
    console.error(err.message);
    const user = getUserById(userId);
    const message = '캐릭터 구매과정에서 오류가 발생했습니다. 다시 시도해주세요';
    console.log(message);
    const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  }
};



export const purchaseEquipment = async ({ socket, userId, payload }) => {
  try {
    const { name, price } = payload;

    const intPrice = parseInt(price);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    const userMoney = await findMoneyByPlayerId(userId);
    const money = userMoney.money;

    //장비 찾기
    // const findPurchaseEquipment = await findEquipment(name);
    // const findPurchaseEquipment = equipmentAssets.find((obj)=>obj.name === name)

    if (money < intPrice) {
      const message = '잔액이 부족합니다';
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }
    //가격 차감
    const newUserMoney = money - intPrice;

    // db저장
    //트랜잭션 적용해야할듯
    await updateUserInventory(user.playerId, findPurchaseEquipment);
    await updateUserMoney(null,user.playerId,newUserMoney);

    const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  } catch (err) {
    console.error(err.message);
    const user = getUserById(userId);
    const message = '장비 구매과정에서 오류가 발생했습니다. 다시 시도해주세요';
    console.log(message);
    const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  }
};
