import { findUserByPlayerId } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createPossession } from '../../db/game/game.db.js';
import CustomError from '../../utils/error/customError.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';

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
const giveCharacterHandler = async ({ socket, userId, payload }) => {
  try {
    const { characterId } = payload;
    const CharacterMapping = {
      //게임 클라이언트가 바뀌기 전까지 임시 매핑
      0: 1, // 근씨 아저씨
      1: 2, // 원씨 아줌마
      2: 4, // 탱씨 아저씨
      3: 8, // 힐씨 아줌마
    };

    const user = await apiRequest(ENDPOINTS.user.findUserByPlayerId, { player_id: userId });
    const [characters] = await apiRequest(ENDPOINTS.game.findPossessionByPlayerID, { player_id: userId });
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
    }

    if (![1, 2, 4, 8].includes(CharacterMapping[characterId])) {
      throw new CustomError(ErrorCodes.PLAYERID_NOT_FOUND, '해당하는 직업을 찾을 수 없습니다');
    }
    if ((characters.characterId & CharacterMapping[characterId]) !== 0) {
      throw new CustomError(ErrorCodes.PLAYERID_NOT_FOUND, '이미 보유한 직업입니다');
    }

    await apiRequest(ENDPOINTS.game.updatePossession, {
      player_id: userId,
      character_id: CharacterMapping[characterId],
    });
  } catch (err) {
    handlerError(socket, err);
  }
};

export default giveCharacterHandler;
const characters = await apiRequest(ENDPOINTS.game.findPossessionByPlayerID, { player_id: 'asdfg' });
console.log(characters);
