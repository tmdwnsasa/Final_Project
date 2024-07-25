import { createMatchHistory, createMatchLog } from '../../db/game/game.db.js';
import { getGameSession, removeGameSession } from '../../sessions/game.session.js';
import { getLobbySession } from '../../sessions/lobby.session.js';
import { createGameEndPacket } from '../../utils/notification/game.notification.js';

//바깥에서 hp가 0이 된 팀을 받아와야되나
//db에 저장할게 많은거같으니 data로 묶어서 받아와야 할듯
export const gameEndHandler = async ({ socket, userId, data }) => {
  try {
    const { sessionId } = data;
    const gameSession = getGameSession(sessionId);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니디');
    }

    await createMatchHistory(sessionId);
    console.log('매치전적이 DB에 저장되었습니다');
    await createMatchLog(sessionId);
    console.log('매치로그가 DB에 저장되었습니다');

    const lobbySession = getLobbySession();
    //게임 종료된 세션 내 유저들 상태를 waiting으로 변경하고 대기실 세션에 추가함
    gameSession.users.forEach((user) => {
      user.status = 'waiting';
      lobbySession.addUser(user);
    });

    //해당 게임세션 삭제
    removeGameSession(sessionId);

    //   대전 결과 패킷 - 통지
    // string winnerTeam = 1
    // repeated UserHistory users = 2

    // message UserState {
    //     string playerId = 1
    //     uint32 kill = 2
    //     uint32 death = 3
    // }

    // const data = {
    // winnerTeam,
    // users, }
    const packet = createGameEndPacket(data);
    
    //패킷 통지
    socket.write(packet);
  } catch (err) {
    console.log('gameEndHandler에서 발생한 오류:', err);
  }
};
