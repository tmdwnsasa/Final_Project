import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds';
import { findMoneyByPlayerId } from '../../db/user/user.db';
import { getUserById } from '../../sessions/user.session';
import CustomError from '../../utils/error/customError';
import { ErrorCodes } from '../../utils/error/errorCodes';
import { createResponse } from '../../utils/response/createResponse';

export const buyCharacter = async ({ socket, userId, data }) => {
  //data에 유저의 골드와, 구매하려는 해당 캐릭터의 간단한 정보?
  const { userMoney, characterId } = data;

  const user = getUserById(userId);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다');
  }

  // 클라 유저골드와 db유저골드와 비교검증
  const serverUserMoney = await findMoneyByPlayerId(userId);

  if (userMoney !== serverUserMoney) {
    throw new CustomError(ErrorCodes, '당신의 골드 보유량이 이상해요~');
  }

  //characterId와 일치하는 해당 캐릭터를 db에서 가져옴
  //const characterInfo = await getCharacterInfo(characterId)
  if (!characterInfo) {
    throw new CustomError(ErrorCodes, '해당 캐릭터 정보를 찾을 수 없어요!');
  }

  //유저의 possession에 이미 보유한 캐릭터일 경우 (상점에는 4캐릭터 전부 띄워놓을 예정)
  const haveCharacter = await getUserPossession(userId, characterId);
  if (haveCharacter) {
    console.log('이미 보유중인 캐릭터');
    const payload = {
      code: 1,
    };
    const packet = createResponse(HANDLER_IDS.BUY_CHARACTER, RESPONSE_SUCCESS_CODE, payload, user.Id);
    socket.write(packet);
    return;
  }

  const characterPrice = characterInfo.price;

  //가격 차감
  const newUserMoney = userMoney - characterPrice;

  // db저장
  // 트랜잭션 필요할듯?
  // await updateUserMoney(userId, newUserMoney);
  // await updatePossession(userId, characterId);

  console.log(`${characterId}가 정상적으로 구매 되었다!`);

  const payload = {
    code: 0,
  };

  const packet = createResponse(HANDLER_IDS.BUY_CHARACTER, RESPONSE_SUCCESS_CODE, payload, user.Id);
  socket.write(packet);
};
