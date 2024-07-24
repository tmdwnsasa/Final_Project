import { getGameSession, removeGameSession } from '../../sessions/game.session';
import { getLobbySession } from '../../sessions/lobby.session';
import { createGameEndPacket } from '../../utils/notification/game.notification';

export const gameEndHandler = async ({ socket, userId, payload }) => {
  try {
    /*
    const { 요청 payload내용 } = payload;
    payload에 뭐가 오는지
    hp 검증?
    추가 검증들 로직 생성
     */
    const gameSession = getGameSession(/*payload에 해당 게임세션을 특정할 키가 있어야 할듯*/);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니디');
    }

    // const allUser = gameSession.getAllUser(); //해당 메서드 아직 없음 필요할까?
    // if (allUser.length < 4) {
    // console.log('유저수가 비정상적인 게임 종료요청입니다');
    // }
    // await createMatchHistory();
    // console.log('매치정보가 DB에 저장되었습니다');
    // DB내용 추가예정

    //로비세션에 유저 다시 추가
    const lobbySession = getLobbySession();
    lobbySession.addUser(userId);

    //해당 게임세션 삭제
    removeGameSession();

    //   대전 결과 패킷 - 통지
    // string winnerTeam = 1
    // repeated UserHistory users = 2

    // message UserState {
    //     string playerId = 1
    //     uint32 kill = 2
    //     uint32 death = 3
    // }
    const packet = createGameEndPacket(data);
    //패킷 통지
    socket.write(packet);
  } catch (err) {
    console.log('gameEndHandler에서 발생한 오류:', err);
  }
};
