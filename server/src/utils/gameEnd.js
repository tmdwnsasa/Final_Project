import apiRequest from '../db/apiRequest.js';
import ENDPOINTS from '../db/endPoint.js';
import { createGameEndPacket } from './notification/game.notification.js';

export const gameEnd = async (gameSessionId, winnerTeam, loserTeam, winTeamColor, startTime, mapName) => {
  try {
    const users = winnerTeam.concat(loserTeam).map((user) => {
      return { playerId: user.playerId, name: user.name, kill: user.kill, death: user.death, damage: user.damage };
    });

    try {
      await apiRequest(ENDPOINTS.game.dbSaveTransaction, {
        win_team: winnerTeam,
        lose_team: loserTeam,
        users,
        session_id: gameSessionId,
        win_team_color: winTeamColor,
        start_time: startTime,
        map_name: mapName,
      });
    } catch (err) {
      console.error(`db저장 실패..,${err.message}`);
    }

    const winPayload = {
      result: 'Win',
      users: users,
    };
    const losePayload = {
      result: 'Lose',
      users: users,
    };

    const winPacket = createGameEndPacket(winPayload);
    const losePacket = createGameEndPacket(losePayload);

    //패킷 통지
    winnerTeam.forEach((user) => user.socket.write(winPacket));
    loserTeam.forEach((user) => user.socket.write(losePacket));
  } catch (err) {
    console.log('gameEndHandler에서 발생한 오류:', err);
  }
};
