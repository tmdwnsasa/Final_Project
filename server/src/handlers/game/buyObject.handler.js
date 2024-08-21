import { characterAssets } from '../../assets/character.asset.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findUserInventoryByPlayerId, purchaseEquipmentTransaction } from '../../db/user/user.db.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getCharacterIds } from './character.handler.js';
/**
 * 캐릭터는 DB에 비트 플래그 형식으로 저장되어 있습니다
 *  - 0000=0 : 캐릭터가 없는 신규 유저
 *  - 0001=1 : 근씨 아저씨 보유
 *  - 0010=2 : 원씨 아줌마 보유
 *  - 0100=4 : 탱씨 아저씨 보유
 *  - 1000=8 : 힐씨 아줌마 보유
 *
 *  - 0011=3 : 근씨, 원씨 보유
 *  - 0101=5 : 근씨, 탱씨 보유
 *  - 1001=9 : 근씨, 힐씨 보유
 *  - 0110=6 : 원씨, 탱씨 보유
 *  - 1010=10 : 원씨, 힐씨 보유
 *  - 1100=12 : 탱씨, 힐씨 보유
 *
 *  - 0111=7 : 근씨, 원씨, 탱씨 보유
 *  - 1011=11 : 근씨, 원씨, 힐씨 보유
 *  - 1101=13 : 근씨, 탱씨, 힐씨 보유
 *  - 1110=14 : 원씨, 탱씨, 힐씨 보유
 *  - 1111=15 : 근씨, 원씨, 탱씨, 힐씨 모두 보유
 */
export const purchaseCharacter = async ({ socket, userId, payload }) => {
  try {
    const CharacterMapping = {
      //게임 클라이언트가 바뀌기 전까지 임시 매핑
      0: 1, // 근씨 아저씨
      1: 2, // 원씨 아줌마
      2: 4, // 탱씨 아저씨
      3: 8, // 힐씨 아줌마
    };
    const { name, sessionId } = payload;

    const user = getUserById(userId);

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (user.sessionId !== sessionId) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const userMoney = await apiRequest(ENDPOINTS.user.findMoneyByPlayerId, { player_id: userId });
    const money = userMoney.money;

    //characterId와 일치하는 해당 캐릭터를 인메모리characterAssets 에서 가져옴
    const characterInfo = characterAssets.find((character) => character.characterName === name);
    if (!characterInfo) {
      throw new CustomError(ErrorCodes.CHARACTERID_NOT_FOUND, '해당 캐릭터 정보를 찾을 수 없어요!');
    }
    //유저의 possession에 이미 보유한 캐릭터일 경우 (상점에는 4캐릭터 전부 띄워놓을 예정)
    const [userPossession] = await apiRequest(ENDPOINTS.game.findPossessionByPlayerID, { player_id: userId });
    const userCharacterArray = getCharacterIds(userPossession.characterId);
    const isCharacterInArray = userCharacterArray.includes(characterInfo.characterId - 1);
    if (isCharacterInArray) {
      const message = `이미 보유중`;
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }

    if (money < characterInfo.price) {
      const message = '잔액이 부족합니다';
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_CHARACTER, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }
    //가격 차감
    const newUserMoney = money - characterInfo.price;

    // db저장 DB 코드에서 트랜잭션으로 처리하도록 나중에 수정해야함
    await apiRequest(ENDPOINTS.game.purchaseCharacter, {
      player_id: userId,
      character_id: CharacterMapping[characterInfo.characterId - 1], //id에서 1뺀값을 기준으로 비트플래그 매핑해서 전달
      money: newUserMoney,
    });
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
    const { name, sessionId } = payload;

    const user = await getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (user.sessionId !== sessionId) {
      throw new CustomError(ErrorCodes.SESSION_ID_MISMATCH, '세션ID 일치하지 않습니다');
    }

    const userInventory = await findUserInventoryByPlayerId(userId);
    if (!userInventory) {
      throw new CustomError(ErrorCodes.INVENTORY_NOT_FOUND, `${user.name}님의 인벤토리를 찾을 수 없습니다`);
    }

    const userMoney = await apiRequest(ENDPOINTS.user.findMoneyByPlayerId, { player_id: userId });
    const money = userMoney.money;

    //장비 찾기
    const findPurchaseEquipment = itemAsset.find((obj) => obj.name === name);
    if (!findPurchaseEquipment) {
      const message = '해당 아이템이 존재하지 않습니다';
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }

    if (money < findPurchaseEquipment.price) {
      const message = '잔액이 부족합니다';
      console.log(message);
      const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
      socket.write(packet);
      return;
    }
    //가격 차감
    const newUserMoney = money - findPurchaseEquipment.price;

    // db서버한테 저장 요청
    await apiRequest(ENDPOINTS.game.purchaseEquipment, {
      player_id: userId,
      item_id: findPurchaseEquipment.itemId,
      item_sprite_name: findPurchaseEquipment.item_sprite_name,
      equip_slot: findPurchaseEquipment.equipSlot,
      money: newUserMoney,
    });
    const message = `${name}(이)가 정상적으로 구매 되었다!`;
    console.log(message);

    const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  } catch (err) {
    console.error(err);
    const user = getUserById(userId);
    const message = '장비 구매과정에서 오류가 발생했습니다. 다시 시도해주세요';
    console.log(message);
    const packet = createResponse(HANDLER_IDS.PURCHASE_EQUIPMENT, RESPONSE_SUCCESS_CODE, { message }, user.playerId);
    socket.write(packet);
  }
};
