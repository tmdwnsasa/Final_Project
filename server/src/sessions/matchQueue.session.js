import createGameHandler from '../handlers/game/createGame.handler';
import { matchQueueSession } from './session';
import { getUserBySocket } from './user.session';

export const addUserinQueue = (socket, data) => {
  const user = getUserBySocket(socket);
  matchQueueSession.push(user);

  // 매치큐에 4명 이상일 때, 팀편성 및 게임 세션 생성
  if (matchQueueSession.length >= 4) {
    const players = matchQueueSession.splice(0, 4);

    // 2팀으로 편성
    const redTeam = players.slice(0, 2); //첫 2 유저
    const blueTeam = players.slice(2, 4); //마지막 2유저

    // createGame 핸들러로 전송
    createGameHandler({
        redTeam: redTeam.map((player) => ({ socket: player.socket, id: player.id })),
        blueTeam: blueTeam.map((player) => ({ socket: player.socket, id: player.id })),
        payload: data,
      });
    }
  return user;
};

// export const removeUserfromQueue = (socket) => {
//   const index = matchQueueSession.findIndex((user) => user.socket === socket);
//   if (index !== -1) {
//     return matchQueueSession.splice(index, 1)[0];
//   }
//   return null;
// };
